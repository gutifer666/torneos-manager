import { Service } from "diod";

import { PostgresClient } from "../../../shared/infrastructure/postgres/PostgresClient";
import { Team } from "../domain/Team";
import { TeamRepository } from "../domain/TeamRepository";
import { TeamFileNumberAlreadyExists } from "../domain/TeamFileNumberAlreadyExists";

@Service()
export class PostgresTeamRepository extends TeamRepository {
	constructor(private readonly client: PostgresClient) {
		super();
	}

	async save(team: Team): Promise<void> {
		const primitives = team.toPrimitives();
		const client = await this.client.getConnection();
		try {
			await client.query("BEGIN");

			const teamQuery = {
				text: `INSERT INTO teams (id, club_name, file_number)
					   VALUES ($1, $2, $3)
					   ON CONFLICT (id) DO UPDATE SET
						 club_name = EXCLUDED.club_name,
						 file_number = EXCLUDED.file_number`,
				values: [primitives.id, primitives.clubName, primitives.fileNumber],
			};
			await client.query(teamQuery.text, teamQuery.values);

			await client.query("DELETE FROM teams_players WHERE team_id = $1", [primitives.id]);

			for (const playerId of primitives.playerIds) {
				await client.query("INSERT INTO teams_players (team_id, player_id) VALUES ($1, $2)", [
					primitives.id,
					playerId,
				]);
			}

			await client.query("COMMIT");
		} catch (e) {
			await client.query("ROLLBACK");
			if ((e as { code?: string }).code === "23505") {
				throw new TeamFileNumberAlreadyExists(primitives.fileNumber);
			}
			throw e;
		} finally {
			client.release();
		}
	}

	async searchAll(): Promise<Team[]> {
		const teamsQuery = "SELECT * FROM teams";
		const teamsRows = await this.client.query<any>(teamsQuery);

		const teams = [];

		for (const row of teamsRows) {
			const playersQuery = "SELECT player_id FROM teams_players WHERE team_id = $1";
			const playersRows = await this.client.query<any>(playersQuery, [row.id]);
			const playerIds = playersRows.map((playerRow: any) => playerRow.player_id);

			teams.push(
				Team.fromPrimitives({
					id: row.id,
					clubName: row.club_name,
					fileNumber: row.file_number,
					playerIds,
				}),
			);
		}

		return teams;
	}
}
