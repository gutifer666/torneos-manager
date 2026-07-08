import { RefereeSearcher } from "../../../../../../src/contexts/referees/referee/application/search/RefereeSearcher";
import { RefereeMother } from "../../domain/RefereeMother";
import { MockRefereeRepository } from "../../infrastructure/MockRefereeRepository";

describe("RefereeSearcher", () => {
	it("should search all referees", async () => {
		const repository = new MockRefereeRepository();
		const searcher = new RefereeSearcher(repository);

		const referee = RefereeMother.create();
		repository.whenSearchAllThenReturn([referee]);

		const result = await searcher.run();

		expect(result).toEqual([referee.toPrimitives()]);
	});
});
