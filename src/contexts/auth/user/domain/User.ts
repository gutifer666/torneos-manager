import { AggregateRoot } from "../../../shared/domain/AggregateRoot";

export type UserRole = "ADMIN" | "REFEREE";

export interface UserPrimitives {
	id: string;
	username: string;
	password: string;
	role: UserRole;
}

export class User extends AggregateRoot {
	constructor(
		private readonly id: string,
		private readonly username: string,
		private readonly password: string,
		private readonly role: UserRole,
	) {
		super();
	}

	static create(id: string, username: string, password: string, role: UserRole): User {
		return new User(id, username, password, role);
	}

	static fromPrimitives(primitives: UserPrimitives): User {
		return new User(primitives.id, primitives.username, primitives.password, primitives.role);
	}

	toPrimitives(): UserPrimitives {
		return {
			id: this.id,
			username: this.username,
			password: this.password,
			role: this.role,
		};
	}
}
