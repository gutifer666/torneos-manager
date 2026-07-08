import { faker } from "@faker-js/faker";
import { Referee, RefereePrimitives } from "../../../../../src/contexts/referees/referee/domain/Referee";

export class RefereeMother {
	static create(params?: Partial<RefereePrimitives>): Referee {
		const primitives: RefereePrimitives = {
			id: faker.string.uuid(),
			name: faker.person.fullName(),
			collegiateNumber: faker.string.alphanumeric(8),
			email: faker.internet.email(),
			password: faker.internet.password(),
			...params,
		};

		return Referee.fromPrimitives(primitives);
	}
}
