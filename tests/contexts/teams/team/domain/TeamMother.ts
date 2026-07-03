import { faker } from "@faker-js/faker";

import { Team, TeamPrimitives } from "../../../../../src/contexts/teams/team/domain/Team";

export class TeamMother {
	static create(params?: Partial<TeamPrimitives>): Team {
		const primitives: TeamPrimitives = {
			id: faker.string.uuid(),
			name: faker.company.name(),
			clubName: faker.company.name(),
			fileNumber: faker.string.alphanumeric(10),
			playerIds: [faker.string.uuid(), faker.string.uuid()],
			...params,
		};

		return Team.fromPrimitives(primitives);
	}
}
