import { PostgresClient } from "@/contexts/shared/infrastructure/postgres/PostgresClient";
import { PostgresTeamRepository } from "@/contexts/teams/team/infrastructure/PostgresTeamRepository";
import { TeamMother } from "../domain/TeamMother";
import { TeamFileNumberAlreadyExists } from "@/contexts/teams/team/domain/TeamFileNumberAlreadyExists";

describe("PostgresTeamRepository", () => {
	let client: PostgresClient;
	let repository: PostgresTeamRepository;

	beforeAll(async () => {
		client = new PostgresClient();
		repository = new PostgresTeamRepository(client);
	});

	beforeEach(async () => {
		await client.query("DELETE FROM tournaments_teams");
		await client.query("DELETE FROM teams_players");
		await client.query("DELETE FROM teams");
	});

	afterAll(async () => {
		await client.stop();
	});

	it("should save a team", async () => {
		const team = TeamMother.create({ playerIds: [] });

		await repository.save(team);

		const result = await client.query<{ club_name: string }>("SELECT * FROM teams WHERE id = $1", [team.toPrimitives().id]);
		expect(result.length).toBe(1);
		expect(result[0].club_name).toBe(team.toPrimitives().clubName);
	});

	it("should update a team if it already exists", async () => {
		const team = TeamMother.create({ playerIds: [] });
		await repository.save(team);

		const updatedTeam = TeamMother.create({
			id: team.toPrimitives().id,
			clubName: "Updated Club Name",
			playerIds: []
		});

		await repository.save(updatedTeam);

		const result = await client.query<{ club_name: string }>("SELECT * FROM teams WHERE id = $1", [team.toPrimitives().id]);
		expect(result.length).toBe(1);
		expect(result[0].club_name).toBe("Updated Club Name");
	});

	it("should throw an error if file number is duplicated", async () => {
		const fileNumber = "TEAM-DUPLICATED-123";
		const team1 = TeamMother.create({ fileNumber, playerIds: [] });
		await repository.save(team1);

		const team2 = TeamMother.create({
			fileNumber,
			playerIds: []
		});

		await expect(repository.save(team2)).rejects.toThrow(TeamFileNumberAlreadyExists);
	});
});
