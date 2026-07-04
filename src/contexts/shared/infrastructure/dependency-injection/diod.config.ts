import { ContainerBuilder } from "diod";

import { PlayerCreator } from "../../../players/player/application/create/PlayerCreator";
import { AllPlayersSearcher } from "../../../players/player/application/search-all/AllPlayersSearcher";
import { PlayerRepository } from "../../../players/player/domain/PlayerRepository";
import { PostgresPlayerRepository } from "../../../players/player/infrastructure/PostgresPlayerRepository";
import { TeamCreator } from "../../../teams/team/application/create/TeamCreator";
import { TeamRepository } from "../../../teams/team/domain/TeamRepository";
import { PostgresTeamRepository } from "../../../teams/team/infrastructure/PostgresTeamRepository";
import { TournamentCreator } from "../../../tournaments/tournament/application/create/TournamentCreator";
import { AllTournamentsSearcher } from "../../../tournaments/tournament/application/search-all/AllTournamentsSearcher";
import { TournamentRepository } from "../../../tournaments/tournament/domain/TournamentRepository";
import { PostgresTournamentRepository } from "../../../tournaments/tournament/infrastructure/PostgresTournamentRepository";
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

// Tournaments
builder.register(TournamentRepository).use(PostgresTournamentRepository);
builder.registerAndUse(TournamentCreator);
builder.registerAndUse(AllTournamentsSearcher);

export const container = builder.build();
