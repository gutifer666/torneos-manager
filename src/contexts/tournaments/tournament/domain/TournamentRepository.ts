import { Tournament } from "./Tournament";

export abstract class TournamentRepository {
	abstract save(tournament: Tournament): Promise<void>;
	abstract searchAll(): Promise<Tournament[]>;
}
