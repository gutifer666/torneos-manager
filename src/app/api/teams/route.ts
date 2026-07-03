import "reflect-metadata";

import { NextResponse } from "next/server";

import { TeamCreator } from "@/contexts/teams/team/application/create/TeamCreator";
import { container } from "@/contexts/shared/infrastructure/dependency-injection/diod.config";
import { HttpNextResponse } from "@/contexts/shared/infrastructure/http/HttpNextResponse";

const creator = container.get(TeamCreator);

export async function POST(request: Request): Promise<NextResponse> {
	const body = await request.json();
	const { id, name, clubName, fileNumber, players } = body;

	try {
		await creator.run(id, name, clubName, fileNumber, players);
		return HttpNextResponse.json({ message: "Team created successfully" }, 201);
	} catch (error) {
		return HttpNextResponse.json({ error: (error as Error).message }, 400);
	}
}
