import "reflect-metadata";
import { container } from "@/contexts/shared/infrastructure/dependency-injection/diod.config";
import { PlayerCreator } from "@/contexts/players/player/application/create/PlayerCreator";
import { AllPlayersSearcher } from "@/contexts/players/player/application/search-all/AllPlayersSearcher";
import { TeamCreator } from "@/contexts/teams/team/application/create/TeamCreator";
import { AllTeamsSearcher } from "@/contexts/teams/team/application/search-all/AllTeamsSearcher";
import { TournamentCreator } from "@/contexts/tournaments/tournament/application/create/TournamentCreator";
import { AllTournamentsSearcher } from "@/contexts/tournaments/tournament/application/search-all/AllTournamentsSearcher";

describe("DI Container Smoke Test", () => {
	it("should be able to resolve all registered services", () => {
		expect(container.get(PlayerCreator)).toBeDefined();
		expect(container.get(AllPlayersSearcher)).toBeDefined();
		expect(container.get(TeamCreator)).toBeDefined();
		expect(container.get(AllTeamsSearcher)).toBeDefined();
		expect(container.get(TournamentCreator)).toBeDefined();
		expect(container.get(AllTournamentsSearcher)).toBeDefined();
	});
});
