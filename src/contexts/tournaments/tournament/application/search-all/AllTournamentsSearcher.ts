import { Service } from "diod";
import { TournamentPrimitives } from "../../domain/Tournament";
import { TournamentRepository } from "../../domain/TournamentRepository";

@Service()
export class AllTournamentsSearcher {
	constructor(private readonly repository: TournamentRepository) {}

	async run(): Promise<TournamentPrimitives[]> {
		const tournaments = await this.repository.searchAll();

		return tournaments.map((tournament) => tournament.toPrimitives());
	}
}
