import { Referee } from "./Referee";

export abstract class RefereeRepository {
	abstract save(referee: Referee): Promise<void>;
	abstract searchAll(): Promise<Referee[]>;
}
