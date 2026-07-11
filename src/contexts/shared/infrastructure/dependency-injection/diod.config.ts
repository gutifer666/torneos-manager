import { ContainerBuilder } from "diod";

import { PlayerCreator } from "../../../players/player/application/create/PlayerCreator";
import { AllPlayersSearcher } from "../../../players/player/application/search-all/AllPlayersSearcher";
import { PlayerRepository } from "../../../players/player/domain/PlayerRepository";
import { PostgresPlayerRepository } from "../../../players/player/infrastructure/PostgresPlayerRepository";
import { TeamCreator } from "../../../teams/team/application/create/TeamCreator";
import { AllTeamsSearcher } from "../../../teams/team/application/search-all/AllTeamsSearcher";
import { TeamRepository } from "../../../teams/team/domain/TeamRepository";
import { PostgresTeamRepository } from "../../../teams/team/infrastructure/PostgresTeamRepository";
import { TournamentCreator } from "../../../tournaments/tournament/application/create/TournamentCreator";
import { AllTournamentsSearcher } from "../../../tournaments/tournament/application/search-all/AllTournamentsSearcher";
import { TournamentDetailsSearcher } from "../../../tournaments/tournament/application/search/TournamentDetailsSearcher";
import { MatchResultUpdater } from "../../../tournaments/tournament/application/update-match/MatchResultUpdater";
import { TournamentRepository } from "../../../tournaments/tournament/domain/TournamentRepository";
import { PostgresTournamentRepository } from "../../../tournaments/tournament/infrastructure/PostgresTournamentRepository";
import { SubmitMatchReport } from "../../../matches/match-reports/application/submit/SubmitMatchReport";
import { MatchReportRepository } from "../../../matches/match-reports/domain/MatchReportRepository";
import { PostgresMatchReportRepository } from "../../../matches/match-reports/infrastructure/PostgresMatchReportRepository";
import { RefereeCreator } from "../../../referees/referee/application/create/RefereeCreator";
import { RefereeSearcher } from "../../../referees/referee/application/search/RefereeSearcher";
import { RefereeRepository } from "../../../referees/referee/domain/RefereeRepository";
import { PostgresRefereeRepository } from "../../../referees/referee/infrastructure/PostgresRefereeRepository";
import { Authenticator } from "../../../auth/user/application/Authenticator";
import { UserFinder } from "../../../auth/user/application/UserFinder";
import { UserRepository } from "../../../auth/user/domain/UserRepository";
import { PostgresUserRepository } from "../../../auth/user/infrastructure/PostgresUserRepository";
import { PostgresClient } from "../postgres/PostgresClient";

const builder = new ContainerBuilder();

// Shared
builder.registerAndUse(PostgresClient);

// Players
builder.register(PlayerRepository).use(PostgresPlayerRepository);
builder.registerAndUse(PlayerCreator);
builder.registerAndUse(AllPlayersSearcher);

// Teams
builder.register(TeamRepository).use(PostgresTeamRepository);
builder.registerAndUse(TeamCreator);
builder.registerAndUse(AllTeamsSearcher);

// Tournaments
builder.register(TournamentRepository).use(PostgresTournamentRepository);
builder.registerAndUse(TournamentCreator);
builder.registerAndUse(AllTournamentsSearcher);
builder.registerAndUse(TournamentDetailsSearcher);
builder.registerAndUse(MatchResultUpdater);

// Matches
builder.register(MatchReportRepository).use(PostgresMatchReportRepository);
builder.registerAndUse(SubmitMatchReport);

// Referees
builder.register(RefereeRepository).use(PostgresRefereeRepository);
builder.registerAndUse(RefereeCreator);
builder.registerAndUse(RefereeSearcher);

// Auth
builder.register(UserRepository).use(PostgresUserRepository);
builder.registerAndUse(Authenticator);
builder.registerAndUse(UserFinder);

export const container = builder.build();
