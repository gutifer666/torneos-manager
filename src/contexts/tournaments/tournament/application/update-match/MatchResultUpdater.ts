import { Service } from "diod";
import { TournamentRepository } from "../../domain/TournamentRepository";

@Service()
export class MatchResultUpdater {
	constructor(private readonly repository: TournamentRepository) {}

	async run(tournamentId: string, matchId: string, localScore: number, visitorScore: number): Promise<void> {
		const tournament = await this.repository.search(tournamentId);

		if (!tournament) {
			throw new Error(`Tournament with id ${tournamentId} not found`);
		}

		tournament.updateMatchResult(matchId, localScore, visitorScore);

		await this.repository.save(tournament);
	}
}
