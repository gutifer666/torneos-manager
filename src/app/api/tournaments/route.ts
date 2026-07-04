import "reflect-metadata";

import { NextResponse } from "next/server";

import { TournamentCreator } from "@/contexts/tournaments/tournament/application/create/TournamentCreator";
import { AllTournamentsSearcher } from "@/contexts/tournaments/tournament/application/search-all/AllTournamentsSearcher";
import { container } from "@/contexts/shared/infrastructure/dependency-injection/diod.config";
import { HttpNextResponse } from "@/contexts/shared/infrastructure/http/HttpNextResponse";

const creator = container.get(TournamentCreator);
const searcher = container.get(AllTournamentsSearcher);

export async function GET(): Promise<NextResponse> {
	try {
		const tournaments = await searcher.run();
		return HttpNextResponse.json(tournaments);
	} catch (error) {
		return HttpNextResponse.json({ error: (error as Error).message }, 400);
	}
}

export async function POST(request: Request): Promise<NextResponse> {
	const body = await request.json();
	const {
		id,
		name,
		description,
		category,
		startDate,
		endDate,
		maxParticipants,
		format,
		rules,
		status,
	} = body;

	try {
		await creator.run(
			id,
			name,
			description,
			category,
			startDate,
			endDate,
			maxParticipants,
			format,
			rules,
			status,
		);
		return HttpNextResponse.json({ message: "Tournament created successfully" }, 201);
	} catch (error) {
		return HttpNextResponse.json({ error: (error as Error).message }, 400);
	}
}
