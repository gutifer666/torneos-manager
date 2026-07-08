import { Referee } from "./Referee";

export abstract class RefereeRepository {
	abstract save(referee: Referee): Promise<void>;
}
