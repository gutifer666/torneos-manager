import { AggregateRoot } from "../../../shared/domain/AggregateRoot";

export interface TeamPrimitives {
	id: string;
	clubName: string;
	fileNumber: string;
	playerIds: string[];
}

export class Team extends AggregateRoot {
	constructor(
		private readonly id: string,
		private readonly clubName: string,
		private readonly fileNumber: string,
		private readonly playerIds: string[],
	) {
		super();
	}

	static create(
		id: string,
		clubName: string,
		fileNumber: string,
		playerIds: string[],
	): Team {
		return new Team(id, clubName, fileNumber, playerIds);
	}

	static fromPrimitives(primitives: TeamPrimitives): Team {
		return new Team(
			primitives.id,
			primitives.clubName,
			primitives.fileNumber,
			primitives.playerIds,
		);
	}

	toPrimitives(): TeamPrimitives {
		return {
			id: this.id,
			clubName: this.clubName,
			fileNumber: this.fileNumber,
			playerIds: this.playerIds,
		};
	}
}
