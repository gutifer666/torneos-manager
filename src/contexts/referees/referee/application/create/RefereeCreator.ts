import { Service } from "diod";
import { Referee } from "../../domain/Referee";
import { RefereeRepository } from "../../domain/RefereeRepository";

@Service()
export class RefereeCreator {
	constructor(private readonly repository: RefereeRepository) {}

	async run(
		id: string,
		name: string,
		collegiateNumber: string,
		email: string,
		password: string,
	): Promise<void> {
		const referee = Referee.create(id, name, collegiateNumber, email, password);

		await this.repository.save(referee);
	}
}
