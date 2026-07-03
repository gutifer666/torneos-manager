import "reflect-metadata";

import { NextResponse } from "next/server";

import { PlayerCreator } from "@/contexts/players/player/application/create/PlayerCreator";
import { container } from "@/contexts/shared/infrastructure/dependency-injection/diod.config";
import { HttpNextResponse } from "@/contexts/shared/infrastructure/http/HttpNextResponse";

const creator = container.get(PlayerCreator);

export async function POST(request: Request): Promise<NextResponse> {
	const body = await request.json();
	const { id, name, surname, birthDate, dorsal, fileNumber } = body;

	try {
		await creator.run(id, name, surname, birthDate, dorsal, fileNumber);
		return HttpNextResponse.json({ message: "Player created successfully" }, 201);
	} catch (error) {
		return HttpNextResponse.json({ error: (error as Error).message }, 400);
	}
}
