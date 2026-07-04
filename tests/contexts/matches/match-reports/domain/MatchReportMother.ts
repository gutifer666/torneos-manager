import { faker } from "@faker-js/faker";
import { MatchReport, MatchReportPrimitives } from "../../../../../src/contexts/matches/match-reports/domain/MatchReport";
import { MatchReportStatus } from "../../../../../src/contexts/matches/match-reports/domain/MatchReportStatus";

export class MatchReportMother {
	static create(params?: Partial<MatchReportPrimitives>): MatchReport {
		const primitives: MatchReportPrimitives = {
			id: faker.string.uuid(),
			matchId: faker.string.uuid(),
			refereeId: faker.string.uuid(),
			status: MatchReportStatus.DRAFT,
			lineups: [],
			incidents: [],
			...params,
		};

		return MatchReport.fromPrimitives(primitives);
	}
}
