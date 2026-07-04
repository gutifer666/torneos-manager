import { Service } from "diod";
import { Tournament } from "../../domain/Tournament";
import { TournamentRepository } from "../../domain/TournamentRepository";

@Service()
export class TournamentCreator {
	constructor(private readonly repository: TournamentRepository) {}

	async run(
		id: string,
		name: string,
		description: string | undefined,
		category: string,
		startDate: string,
		endDate: string,
		maxParticipants: number,
		format: string,
		rules: string,
		status: string,
		participatingTeams: string[],
	): Promise<void> {
		const tournament = Tournament.create(
			id,
			name,
			description,
			category,
			new Date(startDate),
			new Date(endDate),
			maxParticipants,
			format,
			rules,
			status,
			participatingTeams,
		);

		await this.repository.save(tournament);
	}
}
