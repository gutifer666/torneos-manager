import { PostgresClient } from "@/contexts/shared/infrastructure/postgres/PostgresClient";
import { PostgresPlayerRepository } from "@/contexts/players/player/infrastructure/PostgresPlayerRepository";
import { PlayerMother } from "../domain/PlayerMother";
import { PlayerFileNumberAlreadyExists } from "@/contexts/players/player/domain/PlayerFileNumberAlreadyExists";

describe("PostgresPlayerRepository", () => {
	let client: PostgresClient;
	let repository: PostgresPlayerRepository;

	beforeAll(async () => {
		client = new PostgresClient();
		repository = new PostgresPlayerRepository(client);
	});

	beforeEach(async () => {
		await client.query("DELETE FROM teams_players");
		await client.query("DELETE FROM players");
	});

	afterAll(async () => {
		await client.stop();
	});

	it("should save a player", async () => {
		const player = PlayerMother.create();

		await repository.save(player);

		const result = await client.query<{ name: string }>("SELECT * FROM players WHERE id = $1", [player.toPrimitives().id]);
		expect(result.length).toBe(1);
		expect(result[0].name).toBe(player.toPrimitives().name);
	});

	it("should update a player if it already exists", async () => {
		const player = PlayerMother.create();
		await repository.save(player);

		const updatedPlayer = PlayerMother.create({
			id: player.toPrimitives().id,
			name: "Updated Name"
		});

		await repository.save(updatedPlayer);

		const result = await client.query<{ name: string }>("SELECT * FROM players WHERE id = $1", [player.toPrimitives().id]);
		expect(result.length).toBe(1);
		expect(result[0].name).toBe("Updated Name");
	});

	it("should throw an error if file number is duplicated", async () => {
		const fileNumber = "DUPLICATED-123";
		const player1 = PlayerMother.create({ fileNumber });
		await repository.save(player1);

		const player2 = PlayerMother.create({
			fileNumber
		});

		await expect(repository.save(player2)).rejects.toThrow(PlayerFileNumberAlreadyExists);
	});
});
