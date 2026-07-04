import { faker } from "@faker-js/faker";
import { Goal, Card, Substitution, Incident } from "../../../../../src/contexts/matches/match-reports/domain/Incident";

export class IncidentMother {
	static randomGoal(params?: Partial<Goal>): Goal {
		return {
			id: faker.string.uuid(),
			type: "Goal",
			minute: faker.number.int({ min: 1, max: 90 }),
			teamId: faker.string.uuid(),
			playerFileNumber: faker.string.alphanumeric(8),
			goalType: "regular",
			...params,
		};
	}

	static randomCard(params?: Partial<Card>): Card {
		return {
			id: faker.string.uuid(),
			type: "Card",
			minute: faker.number.int({ min: 1, max: 90 }),
			teamId: faker.string.uuid(),
			playerFileNumber: faker.string.alphanumeric(8),
			color: "yellow",
			reason: faker.lorem.sentence(),
			...params,
		};
	}

	static randomSubstitution(params?: Partial<Substitution>): Substitution {
		return {
			id: faker.string.uuid(),
			type: "Substitution",
			minute: faker.number.int({ min: 1, max: 90 }),
			teamId: faker.string.uuid(),
			playerInFileNumber: faker.string.alphanumeric(8),
			playerOutFileNumber: faker.string.alphanumeric(8),
			...params,
		};
	}
}
