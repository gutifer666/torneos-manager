import { Service } from "diod";

import { Player } from "../../domain/Player";
import { PlayerRepository } from "../../domain/PlayerRepository";

@Service()
export class PlayerCreator {
	constructor(private readonly repository: PlayerRepository) {}

	async run(
		id: string,
		name: string,
		surname: string,
		birthDate: string,
		dorsal: number,
		fileNumber: string,
	): Promise<void> {
		const player = Player.create(id, name, surname, new Date(birthDate), dorsal, fileNumber);

		await this.repository.save(player);
	}
}
