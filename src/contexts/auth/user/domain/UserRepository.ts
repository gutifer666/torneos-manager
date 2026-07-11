import { User } from "./User";

export abstract class UserRepository {
	abstract search(username: string): Promise<User | null>;
	abstract findById(id: string): Promise<User | null>;
}
