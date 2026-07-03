import { PlayerCreator } from "../../../../../../src/contexts/players/player/application/create/PlayerCreator";
import { TeamCreator } from "../../../../../../src/contexts/teams/team/application/create/TeamCreator";
import { Team } from "../../../../../../src/contexts/teams/team/domain/Team";
import { TeamMother } from "../../domain/TeamMother";
import { MockTeamRepository } from "../../infrastructure/MockTeamRepository";

describe("TeamCreator", () => {
	it("should create a team with existing players", async () => {
		const repository = new MockTeamRepository();
		const playerCreator = { run: jest.fn() } as unknown as PlayerCreator;
		const creator = new TeamCreator(repository, playerCreator);

		const team = TeamMother.create();
		const primitives = team.toPrimitives();

		await creator.run(
			primitives.id,
			primitives.clubName,
			primitives.fileNumber,
			primitives.playerIds,
		);

		repository.shouldSave(team);
		expect(playerCreator.run).not.toHaveBeenCalled();
	});

	it("should create a team and its players when player data is provided", async () => {
		const repository = new MockTeamRepository();
		const playerCreator = { run: jest.fn() } as unknown as PlayerCreator;
		const creator = new TeamCreator(repository, playerCreator);

		const id = "team-id";
		const clubName = "Club A";
		const fileNumber = "FILE-123";
		const playerInput = {
			id: "player-1",
			name: "John",
			surname: "Doe",
			birthDate: "2000-01-01",
			dorsal: 10,
			fileNumber: "P-1",
		};

		await creator.run(id, clubName, fileNumber, [playerInput]);

		const expectedTeam = Team.create(id, clubName, fileNumber, ["player-1"]);
		repository.shouldSave(expectedTeam);
		expect(playerCreator.run).toHaveBeenCalledWith(
			"player-1",
			"John",
			"Doe",
			"2000-01-01",
			10,
			"P-1",
		);
	});
});
