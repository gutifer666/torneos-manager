import { Service } from "diod";
import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";
import { PostgresClient } from "../../../shared/infrastructure/postgres/PostgresClient";

@Service()
export class PostgresUserRepository extends UserRepository {
	constructor(private readonly client: PostgresClient) {
		super();
	}

	async search(username: string): Promise<User | null> {
		// Try admin first
		const adminQuery = {
			text: "SELECT * FROM admins WHERE username = $1",
			values: [username],
		};

		const adminRows = await this.client.query<{
			id: string;
			username: string;
			password: string;
		}>(adminQuery.text, adminQuery.values);

		if (adminRows.length > 0) {
			const row = adminRows[0];
			return User.fromPrimitives({
				id: row.id,
				username: row.username,
				password: row.password,
				role: "ADMIN",
			});
		}

		// Try referee
		const refereeQuery = {
			text: "SELECT * FROM referees WHERE email = $1",
			values: [username],
		};

		const refereeRows = await this.client.query<{
			id: string;
			email: string;
			password: string;
		}>(refereeQuery.text, refereeQuery.values);

		if (refereeRows.length > 0) {
			const row = refereeRows[0];
			return User.fromPrimitives({
				id: row.id,
				username: row.email,
				password: row.password,
				role: "REFEREE",
			});
		}

		return null;
	}

	async findById(id: string): Promise<User | null> {
		// Try admin first
		const adminQuery = {
			text: "SELECT * FROM admins WHERE id = $1",
			values: [id],
		};

		const adminRows = await this.client.query<{
			id: string;
			username: string;
			password: string;
		}>(adminQuery.text, adminQuery.values);

		if (adminRows.length > 0) {
			const row = adminRows[0];
			return User.fromPrimitives({
				id: row.id,
				username: row.username,
				password: row.password,
				role: "ADMIN",
			});
		}

		// Try referee
		const refereeQuery = {
			text: "SELECT * FROM referees WHERE id = $1",
			values: [id],
		};

		const refereeRows = await this.client.query<{
			id: string;
			email: string;
			password: string;
		}>(refereeQuery.text, refereeQuery.values);

		if (refereeRows.length > 0) {
			const row = refereeRows[0];
			return User.fromPrimitives({
				id: row.id,
				username: row.email,
				password: row.password,
				role: "REFEREE",
			});
		}

		return null;
	}
}
