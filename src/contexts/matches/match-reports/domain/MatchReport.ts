import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { Incident } from "./Incident";
import { MatchReportStatus } from "./MatchReportStatus";

export interface LineupPlayer {
	teamId: string;
	playerFileNumber: string;
	role: "Starter" | "Substitute" | "Staff";
}

export interface MatchReportPrimitives {
	id: string;
	matchId: string;
	refereeId: string;
	status: string;
	actualStartTime?: Date;
	assistantNames?: string;
	extraordinaryIncidents?: string;
	refereeSignature?: string;
	lineups: LineupPlayer[];
	incidents: Incident[];
	originalDocumentUrl?: string;
}

export class MatchReport extends AggregateRoot {
	constructor(
		private readonly id: string,
		private readonly matchId: string,
		private readonly refereeId: string,
		private status: MatchReportStatus,
		private lineups: LineupPlayer[],
		private incidents: Incident[],
		private actualStartTime?: Date,
		private assistantNames?: string,
		private extraordinaryIncidents?: string,
		private refereeSignature?: string,
		private originalDocumentUrl?: string,
	) {
		super();
	}

	static create(id: string, matchId: string, refereeId: string): MatchReport {
		return new MatchReport(id, matchId, refereeId, MatchReportStatus.DRAFT, [], []);
	}

	submit(
		actualStartTime: Date,
		assistantNames: string,
		lineups: LineupPlayer[],
		incidents: Incident[],
		extraordinaryIncidents: string,
		refereeSignature: string,
	): void {
		this.actualStartTime = actualStartTime;
		this.assistantNames = assistantNames;
		this.lineups = this.ensureUniqueLineups(lineups);
		this.incidents = this.ensureUniqueIncidents(incidents);
		this.extraordinaryIncidents = extraordinaryIncidents;
		this.refereeSignature = refereeSignature;
		this.status = MatchReportStatus.SUBMITTED;
	}

	static fromPrimitives(primitives: MatchReportPrimitives): MatchReport {
		const report = new MatchReport(
			primitives.id,
			primitives.matchId,
			primitives.refereeId,
			primitives.status as MatchReportStatus,
			primitives.lineups,
			primitives.incidents,
			primitives.actualStartTime ? new Date(primitives.actualStartTime) : undefined,
			primitives.assistantNames,
			primitives.extraordinaryIncidents,
			primitives.refereeSignature,
			primitives.originalDocumentUrl,
		);
		report.lineups = report.ensureUniqueLineups(primitives.lineups);
		report.incidents = report.ensureUniqueIncidents(primitives.incidents);
		return report;
	}

	private ensureUniqueLineups(lineups: LineupPlayer[]): LineupPlayer[] {
		const unique = new Map<string, LineupPlayer>();
		for (const lineup of lineups) {
			const key = `${lineup.teamId}-${lineup.playerFileNumber}`;
			unique.set(key, lineup);
		}
		return Array.from(unique.values());
	}

	private ensureUniqueIncidents(incidents: Incident[]): Incident[] {
		const unique = new Map<string, Incident>();
		for (const incident of incidents) {
			unique.set(incident.id, incident);
		}
		return Array.from(unique.values());
	}

	toPrimitives(): MatchReportPrimitives {
		return {
			id: this.id,
			matchId: this.matchId,
			refereeId: this.refereeId,
			status: this.status,
			actualStartTime: this.actualStartTime,
			assistantNames: this.assistantNames,
			extraordinaryIncidents: this.extraordinaryIncidents,
			refereeSignature: this.refereeSignature,
			lineups: this.lineups,
			incidents: this.incidents,
			originalDocumentUrl: this.originalDocumentUrl,
		};
	}
}
