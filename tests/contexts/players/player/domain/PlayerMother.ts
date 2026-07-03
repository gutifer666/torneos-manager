import { faker } from "@faker-js/faker";

import { Player, PlayerPrimitives } from "../../../../../src/contexts/players/player/domain/Player";

export class PlayerMother {
	static create(params?: Partial<PlayerPrimitives>): Player {
		const primitives: PlayerPrimitives = {
			id: faker.string.uuid(),
			name: faker.person.firstName(),
			surname: faker.person.lastName(),
			birthDate: faker.date.past().toISOString(),
			dorsal: faker.number.int({ min: 1, max: 99 }),
			fileNumber: faker.string.alphanumeric(10),
			...params,
		};

		return Player.fromPrimitives(primitives);
	}
}
