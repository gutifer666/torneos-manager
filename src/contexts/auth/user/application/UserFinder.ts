import { Service } from "diod";
import { UserRepository } from "../domain/UserRepository";
import { User } from "../domain/User";

@Service()
export class UserFinder {
	constructor(private readonly userRepository: UserRepository) {}

	async find(id: string): Promise<User | null> {
		return this.userRepository.findById(id);
	}
}
