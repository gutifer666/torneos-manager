import { AggregateRoot } from "../../../shared/domain/AggregateRoot";

export interface RefereePrimitives {
	id: string;
	name: string;
	collegiateNumber: string;
	email: string;
	password: string;
}

export class Referee extends AggregateRoot {
	constructor(
		private readonly id: string,
		private readonly name: string,
		private readonly collegiateNumber: string,
		private readonly email: string,
		private readonly password: string,
	) {
		super();
	}

	static create(
		id: string,
		name: string,
		collegiateNumber: string,
		email: string,
		password: string,
	): Referee {
		return new Referee(id, name, collegiateNumber, email, password);
	}

	static fromPrimitives(primitives: RefereePrimitives): Referee {
		return new Referee(
			primitives.id,
			primitives.name,
			primitives.collegiateNumber,
			primitives.email,
			primitives.password,
		);
	}

	toPrimitives(): RefereePrimitives {
		return {
			id: this.id,
			name: this.name,
			collegiateNumber: this.collegiateNumber,
			email: this.email,
			password: this.password,
		};
	}
}
