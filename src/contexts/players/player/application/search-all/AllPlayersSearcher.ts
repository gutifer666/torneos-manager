import { Service } from "diod";

import { PlayerPrimitives } from "../../domain/Player";
import { PlayerRepository } from "../../domain/PlayerRepository";

@Service()
export class AllPlayersSearcher {
	constructor(private readonly repository: PlayerRepository) {}

	async run(): Promise<PlayerPrimitives[]> {
		const players = await this.repository.searchAll();

		return players.map((player) => player.toPrimitives());
	}
}
