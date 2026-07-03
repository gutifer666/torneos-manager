import { Service } from "diod";

import { PostgresClient } from "../../../shared/infrastructure/postgres/PostgresClient";
import { Team } from "../domain/Team";
import { TeamRepository } from "../domain/TeamRepository";

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
				text: `INSERT INTO teams (id, name, club_name, file_number)
					   VALUES ($1, $2, $3, $4)
					   ON CONFLICT (id) DO UPDATE SET
						 name = EXCLUDED.name,
						 club_name = EXCLUDED.club_name,
						 file_number = EXCLUDED.file_number`,
				values: [primitives.id, primitives.name, primitives.clubName, primitives.fileNumber],
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
			throw e;
		} finally {
			client.release();
		}
	}
}
