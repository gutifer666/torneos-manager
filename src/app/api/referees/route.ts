import "reflect-metadata";
import { NextResponse } from "next/server";
import { container } from "@/contexts/shared/infrastructure/dependency-injection/diod.config";
import { RefereeCreator } from "@/contexts/referees/referee/application/create/RefereeCreator";
import { HttpNextResponse } from "@/contexts/shared/infrastructure/http/HttpNextResponse";

export async function POST(request: Request): Promise<NextResponse> {
	try {
		const body = await request.json();
		const creator = container.get(RefereeCreator);

		const id = body.id || crypto.randomUUID();
		const { name, collegiateNumber, email, password } = body;

		await creator.run(id, name, collegiateNumber, email, password);

		return HttpNextResponse.json({ message: "Árbitro registrado correctamente" }, 201);
	} catch (error) {
		return HttpNextResponse.json({ error: (error as Error).message }, 400);
	}
}
