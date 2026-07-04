import { SubmitMatchReport } from "../../../../../../src/contexts/matches/match-reports/application/submit/SubmitMatchReport";
import { MatchReportRepository } from "../../../../../../src/contexts/matches/match-reports/domain/MatchReportRepository";
import { MatchResultUpdater } from "../../../../../../src/contexts/tournaments/tournament/application/update-match/MatchResultUpdater";
import { TournamentRepository } from "../../../../../../src/contexts/tournaments/tournament/domain/TournamentRepository";
import { IncidentMother } from "../../domain/IncidentMother";
import { MatchReportMother } from "../../domain/MatchReportMother";
import { faker } from "@faker-js/faker";
import { Tournament } from "../../../../../../src/contexts/tournaments/tournament/domain/Tournament";

class MockMatchReportRepository implements MatchReportRepository {
	save = jest.fn();
	search = jest.fn();
	searchByMatchId = jest.fn();
}

class MockTournamentRepository implements TournamentRepository {
	save = jest.fn();
	searchAll = jest.fn();
	search = jest.fn();
}

class MockMatchResultUpdater extends MatchResultUpdater {
	constructor() {
		super(null as any);
	}
	run = jest.fn();
}

describe("SubmitMatchReport", () => {
	let repository: MockMatchReportRepository;
	let updater: MockMatchResultUpdater;
	let tournamentRepository: MockTournamentRepository;
	let useCase: SubmitMatchReport;

	beforeEach(() => {
		repository = new MockMatchReportRepository();
		updater = new MockMatchResultUpdater();
		tournamentRepository = new MockTournamentRepository();
		useCase = new SubmitMatchReport(repository, updater, tournamentRepository);
	});

	it("should submit a match report and update tournament match result", async () => {
		const matchId = faker.string.uuid();
		const tournamentId = faker.string.uuid();
		const localTeamId = faker.string.uuid();
		const visitorTeamId = faker.string.uuid();

		const tournament = Tournament.fromPrimitives({
			id: tournamentId,
			name: "Tournament",
			category: "Senior",
			startDate: new Date(),
			endDate: new Date(Date.now() + 86400000),
			maxParticipants: 10,
			format: "Liga",
			rules: "Partido único",
			status: "En Curso",
			participatingTeams: [localTeamId, visitorTeamId],
			matches: [
				{
					id: matchId,
					tournamentId,
					localTeamId,
					visitorTeamId,
					matchday: 1,
					status: "Scheduled",
				},
			],
		});

		tournamentRepository.search.mockResolvedValue(tournament);

		const request = {
			id: faker.string.uuid(),
			matchId,
			tournamentId,
			refereeId: faker.string.uuid(),
			actualStartTime: new Date(),
			assistantNames: "Assistant 1, Assistant 2",
			lineups: [
				{ teamId: localTeamId, playerFileNumber: "P1", role: "Starter" as const },
				{ teamId: visitorTeamId, playerFileNumber: "P2", role: "Starter" as const },
			],
			incidents: [
				IncidentMother.randomGoal({ teamId: localTeamId, playerFileNumber: "P1", goalType: "regular" }),
				IncidentMother.randomGoal({ teamId: localTeamId, playerFileNumber: "P1", goalType: "penalty" }),
				IncidentMother.randomGoal({ teamId: visitorTeamId, playerFileNumber: "P2", goalType: "regular" }),
			],
			extraordinaryIncidents: "None",
			refereeSignature: "Signed",
		};

		await useCase.run(request);

		expect(repository.save).toHaveBeenCalled();
		expect(updater.run).toHaveBeenCalledWith(tournamentId, matchId, 2, 1);
	});

	it("should de-duplicate lineups and incidents before saving", async () => {
		const matchId = faker.string.uuid();
		const tournamentId = faker.string.uuid();
		const localTeamId = faker.string.uuid();
		const visitorTeamId = faker.string.uuid();

		const tournament = Tournament.fromPrimitives({
			id: tournamentId,
			name: "Tournament",
			category: "Senior",
			startDate: new Date(),
			endDate: new Date(Date.now() + 86400000),
			maxParticipants: 10,
			format: "Liga",
			rules: "Partido único",
			status: "En Curso",
			participatingTeams: [localTeamId, visitorTeamId],
			matches: [
				{
					id: matchId,
					tournamentId,
					localTeamId,
					visitorTeamId,
					matchday: 1,
					status: "Scheduled",
				},
			],
		});

		tournamentRepository.search.mockResolvedValue(tournament);

		const incidentId = faker.string.uuid();
		const request = {
			id: faker.string.uuid(),
			matchId,
			tournamentId,
			refereeId: faker.string.uuid(),
			actualStartTime: new Date(),
			assistantNames: "Assistant",
			lineups: [
				{ teamId: localTeamId, playerFileNumber: "P1", role: "Starter" as const },
				{ teamId: localTeamId, playerFileNumber: "P1", role: "Substitute" as const }, // Duplicate player with different role
				{ teamId: visitorTeamId, playerFileNumber: "P2", role: "Starter" as const },
			],
			incidents: [
				{ id: incidentId, type: "Goal" as const, minute: 10, teamId: localTeamId, playerFileNumber: "P1", goalType: "regular" as const },
				{ id: incidentId, type: "Goal" as const, minute: 10, teamId: localTeamId, playerFileNumber: "P1", goalType: "regular" as const }, // Duplicate incident ID
			],
			extraordinaryIncidents: "None",
			refereeSignature: "Signed",
		};

		await useCase.run(request);

		const savedReport = repository.save.mock.calls[0][0];
		const primitives = savedReport.toPrimitives();

		expect(primitives.lineups).toHaveLength(2); // P1 (last role wins) and P2
		expect(primitives.incidents).toHaveLength(1); // Only one incident with that ID
	});

	it("should throw error if match is not found in tournament", async () => {
		const matchId = faker.string.uuid();
		const tournamentId = faker.string.uuid();

		const tournament = Tournament.fromPrimitives({
			id: tournamentId,
			name: "Tournament",
			category: "Senior",
			startDate: new Date(),
			endDate: new Date(Date.now() + 86400000),
			maxParticipants: 10,
			format: "Liga",
			rules: "Partido único",
			status: "En Curso",
			participatingTeams: [],
			matches: [], // Empty matches
		});

		tournamentRepository.search.mockResolvedValue(tournament);

		const request = {
			id: faker.string.uuid(),
			matchId,
			tournamentId,
			refereeId: faker.string.uuid(),
			actualStartTime: new Date(),
			assistantNames: "Assistant",
			lineups: [],
			incidents: [],
			extraordinaryIncidents: "None",
			refereeSignature: "Signed",
		};

		await expect(useCase.run(request)).rejects.toThrow(`Match with id ${matchId} not found in tournament ${tournamentId}`);
	});
});
