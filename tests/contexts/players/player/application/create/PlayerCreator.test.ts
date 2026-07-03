import { PlayerCreator } from "../../../../../../src/contexts/players/player/application/create/PlayerCreator";
import { PlayerMother } from "../../domain/PlayerMother";
import { MockPlayerRepository } from "../../infrastructure/MockPlayerRepository";

describe("PlayerCreator", () => {
	it("should create a player", async () => {
		const repository = new MockPlayerRepository();
		const creator = new PlayerCreator(repository);

		const player = PlayerMother.create();
		const primitives = player.toPrimitives();

		await creator.run(
			primitives.id,
			primitives.name,
			primitives.surname,
			primitives.birthDate,
			primitives.dorsal,
			primitives.fileNumber,
		);

		repository.shouldSave(player);
	});
});
