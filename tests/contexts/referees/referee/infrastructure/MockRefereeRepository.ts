import { Referee } from "../../../../../src/contexts/referees/referee/domain/Referee";
import { RefereeRepository } from "../../../../../src/contexts/referees/referee/domain/RefereeRepository";

export class MockRefereeRepository extends RefereeRepository {
	private readonly mockSave = jest.fn();

	async save(referee: Referee): Promise<void> {
		this.mockSave(referee.toPrimitives());
	}

	shouldSave(referee: Referee): void {
		expect(this.mockSave).toHaveBeenCalledWith(referee.toPrimitives());
	}
}
