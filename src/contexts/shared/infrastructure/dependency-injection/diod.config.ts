import { ContainerBuilder } from "diod";

import { PlayerCreator } from "../../../players/player/application/create/PlayerCreator";
import { AllPlayersSearcher } from "../../../players/player/application/search-all/AllPlayersSearcher";
import { PlayerRepository } from "../../../players/player/domain/PlayerRepository";
import { PostgresPlayerRepository } from "../../../players/player/infrastructure/PostgresPlayerRepository";
import { TeamCreator } from "../../../teams/team/application/create/TeamCreator";
import { TeamRepository } from "../../../teams/team/domain/TeamRepository";
import { PostgresTeamRepository } from "../../../teams/team/infrastructure/PostgresTeamRepository";
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

export const container = builder.build();
