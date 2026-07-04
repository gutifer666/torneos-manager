import { Player } from "../../../../../src/contexts/players/player/domain/Player";
import { PlayerRepository } from "../../../../../src/contexts/players/player/domain/PlayerRepository";

export class MockPlayerRepository extends PlayerRepository {
	private readonly mockSave = jest.fn();

	async save(player: Player): Promise<void> {
		this.mockSave(player.toPrimitives());
	}

	async searchAll(): Promise<Player[]> {
		return [];
	}

	shouldSave(player: Player): void {
		expect(this.mockSave).toHaveBeenCalledWith(player.toPrimitives());
	}
}
