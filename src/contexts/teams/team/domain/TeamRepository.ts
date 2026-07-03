import { Team } from "./Team";

export abstract class TeamRepository {
	abstract save(team: Team): Promise<void>;
}
