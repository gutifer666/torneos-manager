import { Service } from "diod";
import { MatchReportRepository } from "../../domain/MatchReportRepository";
import { MatchReport, LineupPlayer } from "../../domain/MatchReport";
import { Incident } from "../../domain/Incident";
import { MatchResultUpdater } from "../../../../tournaments/tournament/application/update-match/MatchResultUpdater";
import { TournamentRepository } from "../../../../tournaments/tournament/domain/TournamentRepository";

export interface SubmitMatchReportRequest {
	id: string;
	matchId: string;
	tournamentId: string;
	refereeId: string;
	actualStartTime: Date;
	assistantNames: string;
	lineups: LineupPlayer[];
	incidents: Incident[];
	extraordinaryIncidents: string;
	refereeSignature: string;
}

@Service()
export class SubmitMatchReport {
	constructor(
		private readonly repository: MatchReportRepository,
		private readonly matchResultUpdater: MatchResultUpdater,
		private readonly tournamentRepository: TournamentRepository,
	) {}

	async run(request: SubmitMatchReportRequest): Promise<void> {
		// Fetch match to identify local and visitor teams and validate existence
		const tournament = await this.tournamentRepository.search(request.tournamentId);
		if (!tournament) {
			throw new Error(`Tournament with id ${request.tournamentId} not found`);
		}

		const matchPrimitives = tournament.toPrimitives().matches?.find((m) => m.id === request.matchId);
		if (!matchPrimitives) {
			throw new Error(`Match with id ${request.matchId} not found in tournament ${request.tournamentId}`);
		}

		const report = MatchReport.fromPrimitives({
			id: request.id,
			matchId: request.matchId,
			refereeId: request.refereeId,
			status: "Draft",
			lineups: request.lineups,
			incidents: request.incidents,
		});

		report.submit(
			request.actualStartTime,
			request.assistantNames,
			request.lineups,
			request.incidents,
			request.extraordinaryIncidents,
			request.refereeSignature,
		);

		await this.repository.save(report);

		// Calculate scores from incidents
		const localScore = request.incidents.filter(
			(i) => i.type === "Goal" && i.teamId === matchPrimitives.localTeamId && i.goalType !== "autogol",
		).length + request.incidents.filter(
			(i) => i.type === "Goal" && i.teamId === matchPrimitives.visitorTeamId && i.goalType === "autogol",
		).length;

		const visitorScore = request.incidents.filter(
			(i) => i.type === "Goal" && i.teamId === matchPrimitives.visitorTeamId && i.goalType !== "autogol",
		).length + request.incidents.filter(
			(i) => i.type === "Goal" && i.teamId === matchPrimitives.localTeamId && i.goalType === "autogol",
		).length;

		// Update match result in tournament
		await this.matchResultUpdater.run(request.tournamentId, request.matchId, localScore, visitorScore);
	}
}
