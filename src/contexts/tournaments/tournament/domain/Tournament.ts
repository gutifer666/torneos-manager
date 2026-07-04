import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { Match, MatchPrimitives } from "./Match";

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
	participatingTeams: string[];
	matches?: MatchPrimitives[];
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
		private readonly participatingTeams: string[],
		private readonly matches: Match[] = [],
	) {
		super();
		this.ensureDatesAreValid(startDate, endDate);
		this.ensureMaxParticipantsIsEvenForKnockout(format, maxParticipants);
		this.ensureMaxParticipantsIsNotExceeded(maxParticipants, participatingTeams.length);
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
		participatingTeams: string[],
		matches: Match[] = [],
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
			participatingTeams,
			matches,
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

	private ensureMaxParticipantsIsNotExceeded(maxParticipants: number, currentParticipants: number): void {
		if (currentParticipants > maxParticipants) {
			throw new Error(`The maximum number of participants (${maxParticipants}) has been exceeded`);
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
			primitives.participatingTeams || [],
			(primitives.matches || []).map((m) => Match.fromPrimitives(m)),
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
			participatingTeams: this.participatingTeams,
			matches: this.matches.map((m) => m.toPrimitives()),
		};
	}

	updateMatchResult(matchId: string, localScore: number, visitorScore: number): void {
		const match = this.matches.find((m) => m.toPrimitives().id === matchId);
		if (!match) {
			throw new Error(`Match with id ${matchId} not found in tournament ${this.id}`);
		}
		match.updateResult(localScore, visitorScore);
	}

	generateSchedule(matchIds: string[]): Match[] {
		const teams = [...this.participatingTeams];
		// Shuffle teams for randomness
		for (let i = teams.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[teams[i], teams[j]] = [teams[j], teams[i]];
		}

		if (this.format === "Liga") {
			return this.generateLeagueSchedule(teams, matchIds);
		} else if (this.format === "Eliminación directa") {
			return this.generateKnockoutSchedule(teams, matchIds);
		}
		return [];
	}

	private generateLeagueSchedule(teams: string[], matchIds: string[]): Match[] {
		const matches: Match[] = [];
		const numTeams = teams.length;
		if (numTeams < 2) return [];

		const rounds = numTeams % 2 === 0 ? numTeams - 1 : numTeams;
		const teamsPerRound = Math.floor((numTeams + (numTeams % 2)) / 2);
		
		const scheduleTeams = [...teams];
		if (numTeams % 2 !== 0) {
			scheduleTeams.push("BYE"); // Fake team for rest
		}

		const n = scheduleTeams.length;
		let matchIdx = 0;

		for (let round = 0; round < rounds; round++) {
			for (let i = 0; i < n / 2; i++) {
				const local = scheduleTeams[i];
				const visitor = scheduleTeams[n - 1 - i];

				if (local !== "BYE" && visitor !== "BYE") {
					matches.push(Match.create(matchIds[matchIdx++], this.id, local, visitor, round + 1));
				}
			}
			// Rotate teams except the first one
			scheduleTeams.splice(1, 0, scheduleTeams.pop()!);
		}

		return matches;
	}

	private generateKnockoutSchedule(teams: string[], matchIds: string[]): Match[] {
		const matches: Match[] = [];
		const numTeams = teams.length;
		// Solo generamos la primera ronda por ahora, o todo el cuadro si es posible
		// El requisito dice "calendario de los encuentros a disputarse"
		// Para eliminación directa, normalmente se sabe quién juega contra quién en la primera ronda
		
		let matchIdx = 0;
		for (let i = 0; i < numTeams; i += 2) {
			if (i + 1 < numTeams) {
				matches.push(Match.create(matchIds[matchIdx++], this.id, teams[i], teams[i + 1], 1));
			}
		}
		return matches;
	}
}
