import { ContainerBuilder } from "diod";

import { PlayerCreator } from "../../../players/player/application/create/PlayerCreator";
import { PlayerRepository } from "../../../players/player/domain/PlayerRepository";
import { PostgresPlayerRepository } from "../../../players/player/infrastructure/PostgresPlayerRepository";
import { PostgresClient } from "../postgres/PostgresClient";

const builder = new ContainerBuilder();

// Shared
builder.registerAndUse(PostgresClient);

// Players
builder.register(PlayerRepository).use(PostgresPlayerRepository);
builder.registerAndUse(PlayerCreator);

export const container = builder.build();
