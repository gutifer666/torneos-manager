import { AggregateRoot } from "../../../shared/domain/AggregateRoot";

export interface TournamentPrimitives {
	id: string;
	name: string;
	description?: string;
	category: string;
	startDate: Date;
	endDate: Date;
	maxParticipants: number;
	format: string;
	rules: string;
	status: string;
}

export class Tournament extends AggregateRoot {
	constructor(
		private readonly id: string,
		private readonly name: string,
		private readonly description: string | undefined,
		private readonly category: string,
		private readonly startDate: Date,
		private readonly endDate: Date,
		private readonly maxParticipants: number,
		private readonly format: string,
		private readonly rules: string,
		private readonly status: string,
	) {
		super();
		this.ensureDatesAreValid(startDate, endDate);
		this.ensureMaxParticipantsIsEvenForKnockout(format, maxParticipants);
	}

	static create(
		id: string,
		name: string,
		description: string | undefined,
		category: string,
		startDate: Date,
		endDate: Date,
		maxParticipants: number,
		format: string,
		rules: string,
		status: string,
	): Tournament {
		if (startDate < new Date()) {
			throw new Error("The start date cannot be in the past");
		}

		return new Tournament(
			id,
			name,
			description,
			category,
			startDate,
			endDate,
			maxParticipants,
			format,
			rules,
			status,
		);
	}

	private ensureDatesAreValid(startDate: Date, endDate: Date): void {
		if (endDate <= startDate) {
			throw new Error("The end date must be after the start date");
		}
	}

	private ensureMaxParticipantsIsEvenForKnockout(format: string, maxParticipants: number): void {
		if (format === "Eliminación directa" && maxParticipants % 2 !== 0) {
			throw new Error("The maximum number of participants must be even for knockout format");
		}
	}

	static fromPrimitives(primitives: TournamentPrimitives): Tournament {
		return new Tournament(
			primitives.id,
			primitives.name,
			primitives.description,
			primitives.category,
			new Date(primitives.startDate),
			new Date(primitives.endDate),
			primitives.maxParticipants,
			primitives.format,
			primitives.rules,
			primitives.status,
		);
	}

	toPrimitives(): TournamentPrimitives {
		return {
			id: this.id,
			name: this.name,
			description: this.description,
			category: this.category,
			startDate: this.startDate,
			endDate: this.endDate,
			maxParticipants: this.maxParticipants,
			format: this.format,
			rules: this.rules,
			status: this.status,
		};
	}
}
