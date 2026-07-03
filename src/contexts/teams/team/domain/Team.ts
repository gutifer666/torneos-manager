import { AggregateRoot } from "../../../shared/domain/AggregateRoot";

export interface TeamPrimitives {
	id: string;
	name: string;
	clubName: string;
	fileNumber: string;
	playerIds: string[];
}

export class Team extends AggregateRoot {
	constructor(
		private readonly id: string,
		private readonly name: string,
		private readonly clubName: string,
		private readonly fileNumber: string,
		private readonly playerIds: string[],
	) {
		super();
	}

	static create(
		id: string,
		name: string,
		clubName: string,
		fileNumber: string,
		playerIds: string[],
	): Team {
		return new Team(id, name, clubName, fileNumber, playerIds);
	}

	static fromPrimitives(primitives: TeamPrimitives): Team {
		return new Team(
			primitives.id,
			primitives.name,
			primitives.clubName,
			primitives.fileNumber,
			primitives.playerIds,
		);
	}

	toPrimitives(): TeamPrimitives {
		return {
			id: this.id,
			name: this.name,
			clubName: this.clubName,
			fileNumber: this.fileNumber,
			playerIds: this.playerIds,
		};
	}
}
