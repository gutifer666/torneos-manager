import { Team } from "../../../../../src/contexts/teams/team/domain/Team";
import { TeamRepository } from "../../../../../src/contexts/teams/team/domain/TeamRepository";

export class MockTeamRepository extends TeamRepository {
	private readonly mockSave = jest.fn();

	async save(team: Team): Promise<void> {
		this.mockSave(team.toPrimitives());
	}

	async searchAll(): Promise<Team[]> {
		return [];
	}

	shouldSave(team: Team): void {
		expect(this.mockSave).toHaveBeenCalledWith(team.toPrimitives());
	}
}
