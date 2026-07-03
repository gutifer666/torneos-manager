import { AggregateRoot } from "../../../shared/domain/AggregateRoot";

export interface PlayerPrimitives {
	id: string;
	name: string;
	surname: string;
	birthDate: string;
	dorsal: number;
	fileNumber: string;
}

export class Player extends AggregateRoot {
	constructor(
		private readonly id: string,
		private readonly name: string,
		private readonly surname: string,
		private readonly birthDate: Date,
		private readonly dorsal: number,
		private readonly fileNumber: string,
	) {
		super();
	}

	static create(
		id: string,
		name: string,
		surname: string,
		birthDate: Date,
		dorsal: number,
		fileNumber: string,
	): Player {
		return new Player(id, name, surname, birthDate, dorsal, fileNumber);
	}

	static fromPrimitives(primitives: PlayerPrimitives): Player {
		return new Player(
			primitives.id,
			primitives.name,
			primitives.surname,
			new Date(primitives.birthDate),
			primitives.dorsal,
			primitives.fileNumber,
		);
	}

	toPrimitives(): PlayerPrimitives {
		return {
			id: this.id,
			name: this.name,
			surname: this.surname,
			birthDate: this.birthDate.toISOString(),
			dorsal: this.dorsal,
			fileNumber: this.fileNumber,
		};
	}
}
