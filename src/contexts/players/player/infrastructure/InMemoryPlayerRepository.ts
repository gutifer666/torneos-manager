import { Service } from "diod";

import { Player } from "../domain/Player";
import { PlayerRepository } from "../domain/PlayerRepository";

@Service()
export class InMemoryPlayerRepository extends PlayerRepository {
	private readonly players: Player[] = [];

	async save(player: Player): Promise<void> {
		this.players.push(player);
	}
}
