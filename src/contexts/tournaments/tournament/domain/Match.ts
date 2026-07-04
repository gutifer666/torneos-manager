export interface MatchPrimitives {
	id: string;
	tournamentId: string;
	localTeamId: string;
	visitorTeamId: string;
	matchday: number;
	localScore?: number;
	visitorScore?: number;
	status: string;
}

export class Match {
	constructor(
		private readonly id: string,
		private readonly tournamentId: string,
		private readonly localTeamId: string,
		private readonly visitorTeamId: string,
		private readonly matchday: number,
		private localScore: number | undefined,
		private visitorScore: number | undefined,
		private status: string,
	) {}

	static create(
		id: string,
		tournamentId: string,
		localTeamId: string,
		visitorTeamId: string,
		matchday: number,
	): Match {
		return new Match(id, tournamentId, localTeamId, visitorTeamId, matchday, undefined, undefined, "Scheduled");
	}

	updateResult(localScore: number, visitorScore: number): void {
		this.localScore = localScore;
		this.visitorScore = visitorScore;
		this.status = "Finished";
	}

	static fromPrimitives(primitives: MatchPrimitives): Match {
		return new Match(
			primitives.id,
			primitives.tournamentId,
			primitives.localTeamId,
			primitives.visitorTeamId,
			primitives.matchday,
			primitives.localScore,
			primitives.visitorScore,
			primitives.status,
		);
	}

	toPrimitives(): MatchPrimitives {
		return {
			id: this.id,
			tournamentId: this.tournamentId,
			localTeamId: this.localTeamId,
			visitorTeamId: this.visitorTeamId,
			matchday: this.matchday,
			localScore: this.localScore,
			visitorScore: this.visitorScore,
			status: this.status,
		};
	}
}
