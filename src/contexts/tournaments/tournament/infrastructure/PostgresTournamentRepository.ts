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
		const query = {
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

		await this.client.query(query.text, query.values);
	}

	async searchAll(): Promise<Tournament[]> {
		const query = "SELECT * FROM tournaments";
		const rows = await this.client.query<any>(query);

		return rows.map((row) =>
			Tournament.fromPrimitives({
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
			}),
		);
	}
}
