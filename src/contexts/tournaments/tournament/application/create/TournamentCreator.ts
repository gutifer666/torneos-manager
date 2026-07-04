import { Service } from "diod";
import crypto from "crypto";
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
		const tempTournament = Tournament.create(
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

		const numTeams = participatingTeams.length;
		let numMatches = 0;
		if (format === "Liga") {
			numMatches = (numTeams * (numTeams - 1)) / 2;
		} else if (format === "Eliminación directa") {
			numMatches = Math.floor(numTeams / 2);
		}

		const matchIds = Array.from({ length: numMatches }, () => crypto.randomUUID());
		const matches = tempTournament.generateSchedule(matchIds);

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
			matches,
		);

		await this.repository.save(tournament);
	}
}
