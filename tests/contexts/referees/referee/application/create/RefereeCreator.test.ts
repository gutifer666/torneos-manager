import { RefereeCreator } from "../../../../../../src/contexts/referees/referee/application/create/RefereeCreator";
import { RefereeMother } from "../../domain/RefereeMother";
import { MockRefereeRepository } from "../../infrastructure/MockRefereeRepository";

describe("RefereeCreator", () => {
	it("should create a referee", async () => {
		const repository = new MockRefereeRepository();
		const creator = new RefereeCreator(repository);

		const referee = RefereeMother.create();
		const primitives = referee.toPrimitives();

		await creator.run(
			primitives.id,
			primitives.name,
			primitives.collegiateNumber,
			primitives.email,
			primitives.password,
		);

		repository.shouldSave(referee);
	});
});
