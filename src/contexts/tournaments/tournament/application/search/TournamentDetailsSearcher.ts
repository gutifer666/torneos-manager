import { Service } from "diod";
import { TournamentPrimitives } from "../../domain/Tournament";
import { TournamentRepository } from "../../domain/TournamentRepository";

@Service()
export class TournamentDetailsSearcher {
	constructor(private readonly repository: TournamentRepository) {}

	async run(id: string): Promise<TournamentPrimitives | null> {
		const tournament = await this.repository.search(id);

		if (!tournament) {
			return null;
		}

		return tournament.toPrimitives();
	}
}
