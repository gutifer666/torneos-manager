import { Referee } from "../../../../../src/contexts/referees/referee/domain/Referee";
import { RefereeRepository } from "../../../../../src/contexts/referees/referee/domain/RefereeRepository";

export class MockRefereeRepository extends RefereeRepository {
	private readonly mockSave = jest.fn();
	private readonly mockSearchAll = jest.fn();

	async save(referee: Referee): Promise<void> {
		this.mockSave(referee.toPrimitives());
	}

	async searchAll(): Promise<Referee[]> {
		return this.mockSearchAll();
	}

	shouldSave(referee: Referee): void {
		expect(this.mockSave).toHaveBeenCalledWith(referee.toPrimitives());
	}

	whenSearchAllThenReturn(referees: Referee[]): void {
		this.mockSearchAll.mockReturnValue(referees);
	}
}
