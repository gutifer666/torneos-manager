import { Service } from "diod";
import { PostgresClient } from "../../../shared/infrastructure/postgres/PostgresClient";
import { Tournament } from "../domain/Tournament";
import { TournamentRepository } from "../domain/TournamentRepository";

@Service()
export class PostgresTournamentRepository extends TournamentRepository {
	constructor(private readonly client: PostgresClient) {
		super();
	}

	async save(tournament: Tournament): Promise<void> {
		const primitives = tournament.toPrimitives();
		const client = await this.client.getConnection();
		
		try {
			await client.query("BEGIN");
			
			const tournamentQuery = {
				text: `INSERT INTO tournaments (id, name, description, category, start_date, end_date, max_participants, format, rules, status)
					   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
					   ON CONFLICT (id) DO UPDATE SET
						 name = EXCLUDED.name,
						 description = EXCLUDED.description,
						 category = EXCLUDED.category,
						 start_date = EXCLUDED.start_date,
						 end_date = EXCLUDED.end_date,
						 max_participants = EXCLUDED.max_participants,
						 format = EXCLUDED.format,
						 rules = EXCLUDED.rules,
						 status = EXCLUDED.status`,
				values: [
					primitives.id,
					primitives.name,
					primitives.description,
					primitives.category,
					primitives.startDate,
					primitives.endDate,
					primitives.maxParticipants,
					primitives.format,
					primitives.rules,
					primitives.status,
				],
			};

			await client.query(tournamentQuery.text, tournamentQuery.values);

			// Delete existing teams and re-insert
			await client.query("DELETE FROM tournaments_teams WHERE tournament_id = $1", [primitives.id]);

			if (primitives.participatingTeams.length > 0) {
				for (const teamId of primitives.participatingTeams) {
					await client.query(
						"INSERT INTO tournaments_teams (tournament_id, team_id) VALUES ($1, $2)",
						[primitives.id, teamId]
					);
				}
			}

			// Persist matches
			if (primitives.matches && primitives.matches.length > 0) {
				for (const match of primitives.matches) {
					await client.query(
						`INSERT INTO matches (id, tournament_id, local_team_id, visitor_team_id, matchday, local_score, visitor_score, status)
						 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
						 ON CONFLICT (id) DO UPDATE SET
						   local_score = EXCLUDED.local_score,
						   visitor_score = EXCLUDED.visitor_score,
						   status = EXCLUDED.status`,
						[
							match.id,
							match.tournamentId,
							match.localTeamId,
							match.visitorTeamId,
							match.matchday,
							match.localScore,
							match.visitorScore,
							match.status,
						]
					);
				}
			}

			await client.query("COMMIT");
		} catch (error) {
			await client.query("ROLLBACK");
			throw error;
		} finally {
			client.release();
		}
	}

	async searchAll(): Promise<Tournament[]> {
		const tournamentsQuery = "SELECT * FROM tournaments";
		const tournamentsRows = await this.client.query<any>(tournamentsQuery);

		const tournaments = [];

		for (const row of tournamentsRows) {
			tournaments.push(await this.hydrateTournament(row));
		}

		return tournaments;
	}

	async search(id: string): Promise<Tournament | null> {
		const tournamentQuery = "SELECT * FROM tournaments WHERE id = $1";
		const tournamentRows = await this.client.query<any>(tournamentQuery, [id]);

		if (tournamentRows.length === 0) {
			return null;
		}

		return this.hydrateTournament(tournamentRows[0]);
	}

	private async hydrateTournament(row: any): Promise<Tournament> {
		const teamsQuery = "SELECT team_id FROM tournaments_teams WHERE tournament_id = $1";
		const teamsRows = await this.client.query<any>(teamsQuery, [row.id]);
		const participatingTeams = teamsRows.map((teamRow: any) => teamRow.team_id);

		const matchesQuery = "SELECT * FROM matches WHERE tournament_id = $1 ORDER BY matchday ASC";
		const matchesRows = await this.client.query<any>(matchesQuery, [row.id]);
		const matches = matchesRows.map((matchRow: any) => ({
			id: matchRow.id,
			tournamentId: matchRow.tournament_id,
			localTeamId: matchRow.local_team_id,
			visitorTeamId: matchRow.visitor_team_id,
			matchday: matchRow.matchday,
			localScore: matchRow.local_score,
			visitorScore: matchRow.visitor_score,
			status: matchRow.status,
		}));

		return Tournament.fromPrimitives({
			id: row.id,
			name: row.name,
			description: row.description,
			category: row.category,
			startDate: row.start_date,
			endDate: row.end_date,
			maxParticipants: row.max_participants,
			format: row.format,
			rules: row.rules,
			status: row.status,
			participatingTeams,
			matches,
		});
	}
}
