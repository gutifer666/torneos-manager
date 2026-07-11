import { Service } from "diod";
import { UserRepository } from "../domain/UserRepository";
import { User } from "../domain/User";

@Service()
export class Authenticator {
	constructor(private readonly userRepository: UserRepository) {}

	async authenticate(username: string, password: string): Promise<User | null> {
		const user = await this.userRepository.search(username);

		if (!user) {
			return null;
		}

		if (user.toPrimitives().password !== password) {
			return null;
		}

		return user;
	}
}
