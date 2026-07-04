import "reflect-metadata";

import { NextResponse } from "next/server";

import { TeamCreator } from "@/contexts/teams/team/application/create/TeamCreator";
import { AllTeamsSearcher } from "@/contexts/teams/team/application/search-all/AllTeamsSearcher";
import { container } from "@/contexts/shared/infrastructure/dependency-injection/diod.config";
import { HttpNextResponse } from "@/contexts/shared/infrastructure/http/HttpNextResponse";

const creator = container.get(TeamCreator);
const searcher = container.get(AllTeamsSearcher);

export async function GET(): Promise<NextResponse> {
	try {
		const teams = await searcher.run();
		return HttpNextResponse.json(teams.map((team) => team.toPrimitives()), 200);
	} catch (error) {
		return HttpNextResponse.json({ error: (error as Error).message }, 500);
	}
}

export async function POST(request: Request): Promise<NextResponse> {
	const body = await request.json();
	const { id, clubName, fileNumber, players } = body;

	try {
		await creator.run(id, clubName, fileNumber, players);
		return HttpNextResponse.json({ message: "Team created successfully" }, 201);
	} catch (error) {
		return HttpNextResponse.json({ error: (error as Error).message }, 400);
	}
}
