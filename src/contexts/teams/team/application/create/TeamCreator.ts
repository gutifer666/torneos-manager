import { Service } from "diod";

import { PlayerCreator } from "../../../../players/player/application/create/PlayerCreator";
import { Team } from "../../domain/Team";
import { TeamRepository } from "../../domain/TeamRepository";

export interface PlayerInput {
	id: string;
	name?: string;
	surname?: string;
	birthDate?: string;
	dorsal?: number;
	fileNumber?: string;
}

@Service()
export class TeamCreator {
	constructor(
		private readonly repository: TeamRepository,
		private readonly playerCreator: PlayerCreator,
	) {}

	async run(
		id: string,
		clubName: string,
		fileNumber: string,
		players: (string | PlayerInput)[],
	): Promise<void> {
		const playerIds: string[] = [];

		for (const player of players) {
			if (typeof player === "string") {
				playerIds.push(player);
			} else {
				if (
					player.name !== undefined &&
					player.surname !== undefined &&
					player.birthDate !== undefined &&
					player.dorsal !== undefined &&
					player.fileNumber !== undefined
				) {
					await this.playerCreator.run(
						player.id,
						player.name,
						player.surname,
						player.birthDate,
						player.dorsal,
						player.fileNumber,
					);
				}
				playerIds.push(player.id);
			}
		}

		const team = Team.create(id, clubName, fileNumber, playerIds);

		await this.repository.save(team);
	}
}
