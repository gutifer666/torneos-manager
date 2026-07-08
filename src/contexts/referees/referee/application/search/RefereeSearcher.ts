import { Service } from "diod";
import { RefereePrimitives } from "../../domain/Referee";
import { RefereeRepository } from "../../domain/RefereeRepository";

@Service()
export class RefereeSearcher {
	constructor(private readonly repository: RefereeRepository) {}

	async run(): Promise<RefereePrimitives[]> {
		const referees = await this.repository.searchAll();

		return referees.map((referee) => referee.toPrimitives());
	}
}
