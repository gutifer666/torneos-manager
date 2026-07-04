import { MatchReport } from "./MatchReport";

export abstract class MatchReportRepository {
	abstract save(report: MatchReport): Promise<void>;
	abstract search(id: string): Promise<MatchReport | null>;
	abstract searchByMatchId(matchId: string): Promise<MatchReport | null>;
}
