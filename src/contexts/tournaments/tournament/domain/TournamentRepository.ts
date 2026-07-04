import { Tournament } from "./Tournament";

export abstract class TournamentRepository {
	abstract save(tournament: Tournament): Promise<void>;
	abstract searchAll(): Promise<Tournament[]>;
	abstract search(id: string): Promise<Tournament | null>;
}
