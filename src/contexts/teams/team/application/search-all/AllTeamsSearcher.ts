import { Service } from "diod";
import { Team } from "../../domain/Team";
import { TeamRepository } from "../../domain/TeamRepository";

@Service()
export class AllTeamsSearcher {
	constructor(private readonly repository: TeamRepository) {}

	async run(): Promise<Team[]> {
		return this.repository.searchAll();
	}
}
