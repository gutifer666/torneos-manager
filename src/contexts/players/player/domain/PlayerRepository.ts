import { Player } from "./Player";

export abstract class PlayerRepository {
	abstract save(player: Player): Promise<void>;
	abstract searchAll(): Promise<Player[]>;
}
