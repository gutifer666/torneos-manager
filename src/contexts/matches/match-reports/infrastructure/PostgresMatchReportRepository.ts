import { Service } from "diod";
import { PostgresClient } from "../../../shared/infrastructure/postgres/PostgresClient";
import { MatchReport } from "../domain/MatchReport";
import { MatchReportRepository } from "../domain/MatchReportRepository";
import { Incident } from "../domain/Incident";

@Service()
export class PostgresMatchReportRepository extends MatchReportRepository {
	constructor(private readonly client: PostgresClient) {
		super();
	}

	async save(report: MatchReport): Promise<void> {
		const primitives = report.toPrimitives();
		const client = await this.client.getConnection();

		try {
			await client.query("BEGIN");

			const reportQuery = {
				text: `INSERT INTO match_reports (id, match_id, referee_id, status, actual_start_time, assistant_names, extraordinary_incidents, referee_signature, original_document_url)
                       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                       ON CONFLICT (id) DO UPDATE SET
                         status = EXCLUDED.status,
                         actual_start_time = EXCLUDED.actual_start_time,
                         assistant_names = EXCLUDED.assistant_names,
                         extraordinary_incidents = EXCLUDED.extraordinary_incidents,
                         referee_signature = EXCLUDED.referee_signature,
                         original_document_url = EXCLUDED.original_document_url`,
				values: [
					primitives.id,
					primitives.matchId,
					primitives.refereeId,
					primitives.status,
					primitives.actualStartTime,
					primitives.assistantNames,
					primitives.extraordinaryIncidents,
					primitives.refereeSignature,
					primitives.originalDocumentUrl,
				],
			};

			await client.query(reportQuery.text, reportQuery.values);

			// Lineups
			await client.query("DELETE FROM match_lineups WHERE match_id = $1", [primitives.matchId]);
			for (const lineup of primitives.lineups) {
				await client.query(
					`INSERT INTO match_lineups (match_id, team_id, player_file_number, player_role) 
                     VALUES ($1, $2, $3, $4)
                     ON CONFLICT (match_id, team_id, player_file_number) DO UPDATE SET player_role = EXCLUDED.player_role`,
					[primitives.matchId, lineup.teamId, lineup.playerFileNumber, lineup.role],
				);
			}

			// Incidents
			await client.query("DELETE FROM match_incidents WHERE match_id = $1", [primitives.matchId]);
			for (const incident of primitives.incidents) {
				await client.query(
					`INSERT INTO match_incidents (id, match_id, type, minute, player_file_number, team_id, goal_type, card_color, card_reason, player_in_file_number, player_out_file_number)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                     ON CONFLICT (id) DO UPDATE SET
                         type = EXCLUDED.type,
                         minute = EXCLUDED.minute,
                         player_file_number = EXCLUDED.player_file_number,
                         team_id = EXCLUDED.team_id,
                         goal_type = EXCLUDED.goal_type,
                         card_color = EXCLUDED.card_color,
                         card_reason = EXCLUDED.card_reason,
                         player_in_file_number = EXCLUDED.player_in_file_number,
                         player_out_file_number = EXCLUDED.player_out_file_number`,
					[
						incident.id,
						primitives.matchId,
						incident.type,
						incident.minute,
						(incident as any).playerFileNumber || null,
						incident.teamId,
						(incident as any).goalType || null,
						(incident as any).color || null,
						(incident as any).reason || null,
						(incident as any).playerInFileNumber || null,
						(incident as any).playerOutFileNumber || null,
					],
				);
			}

			await client.query("COMMIT");
		} catch (error) {
			await client.query("ROLLBACK");
			throw error;
		} finally {
			client.release();
		}
	}

	async search(id: string): Promise<MatchReport | null> {
		const reportQuery = "SELECT * FROM match_reports WHERE id = $1";
		const reportRows = await this.client.query<any>(reportQuery, [id]);

		if (reportRows.length === 0) {
			return null;
		}

		return this.hydrateReport(reportRows[0]);
	}

	async searchByMatchId(matchId: string): Promise<MatchReport | null> {
		const reportQuery = "SELECT * FROM match_reports WHERE match_id = $1";
		const reportRows = await this.client.query<any>(reportQuery, [matchId]);

		if (reportRows.length === 0) {
			return null;
		}

		return this.hydrateReport(reportRows[0]);
	}

	private async hydrateReport(row: any): Promise<MatchReport> {
		const matchId = row.match_id;

		const lineupsQuery = "SELECT * FROM match_lineups WHERE match_id = $1";
		const lineupsRows = await this.client.query<any>(lineupsQuery, [matchId]);
		const lineups = lineupsRows.map((lineupRow: any) => ({
			teamId: lineupRow.team_id,
			playerFileNumber: lineupRow.player_file_number,
			role: lineupRow.player_role,
		}));

		const incidentsQuery = "SELECT * FROM match_incidents WHERE match_id = $1 ORDER BY minute ASC";
		const incidentsRows = await this.client.query<any>(incidentsQuery, [matchId]);
		const incidents = incidentsRows.map((incidentRow: any) => ({
			id: incidentRow.id,
			type: incidentRow.type,
			minute: incidentRow.minute,
			teamId: incidentRow.team_id,
			playerFileNumber: incidentRow.player_file_number,
			goalType: incidentRow.goal_type,
			color: incidentRow.card_color,
			reason: incidentRow.card_reason,
			playerInFileNumber: incidentRow.player_in_file_number,
			playerOutFileNumber: incidentRow.player_out_file_number,
		})) as Incident[];

		return MatchReport.fromPrimitives({
			id: row.id,
			matchId: row.match_id,
			refereeId: row.referee_id,
			status: row.status,
			actualStartTime: row.actual_start_time,
			assistantNames: row.assistant_names,
			extraordinaryIncidents: row.extraordinary_incidents,
			refereeSignature: row.referee_signature,
			lineups,
			incidents,
			originalDocumentUrl: row.original_document_url,
		});
	}
}
