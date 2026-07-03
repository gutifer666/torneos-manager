import { Team } from "../../../../../src/contexts/teams/team/domain/Team";
import { TeamRepository } from "../../../../../src/contexts/teams/team/domain/TeamRepository";

export class MockTeamRepository implements TeamRepository {
	private readonly mockSave = jest.fn();

	async save(team: Team): Promise<void> {
		this.mockSave(team.toPrimitives());
	}

	shouldSave(team: Team): void {
		expect(this.mockSave).toHaveBeenCalledWith(team.toPrimitives());
	}
}
