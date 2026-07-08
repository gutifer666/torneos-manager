import { PostgresClient } from "@/contexts/shared/infrastructure/postgres/PostgresClient";
import { PostgresRefereeRepository } from "@/contexts/referees/referee/infrastructure/PostgresRefereeRepository";
import { RefereeMother } from "../domain/RefereeMother";

describe("PostgresRefereeRepository", () => {
	let client: PostgresClient;
	let repository: PostgresRefereeRepository;

	beforeAll(async () => {
		client = new PostgresClient();
		repository = new PostgresRefereeRepository(client);
	});

	beforeEach(async () => {
		await client.query("DELETE FROM referees");
	});

	afterAll(async () => {
		await client.stop();
	});

	it("should save a referee", async () => {
		const referee = RefereeMother.create();

		await repository.save(referee);

		const result = await client.query<{ name: string }>("SELECT * FROM referees WHERE id = $1", [referee.toPrimitives().id]);
		expect(result.length).toBe(1);
		expect(result[0].name).toBe(referee.toPrimitives().name);
	});

	it("should search all referees", async () => {
		const referee1 = RefereeMother.create();
		const referee2 = RefereeMother.create();

		await repository.save(referee1);
		await repository.save(referee2);

		const result = await repository.searchAll();

		expect(result.length).toBe(2);
		expect(result.some(r => r.toPrimitives().id === referee1.toPrimitives().id)).toBe(true);
		expect(result.some(r => r.toPrimitives().id === referee2.toPrimitives().id)).toBe(true);
	});
});
