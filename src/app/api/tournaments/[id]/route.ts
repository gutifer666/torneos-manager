import "reflect-metadata";

import { NextResponse } from "next/server";
import { container } from "@/contexts/shared/infrastructure/dependency-injection/diod.config";
import { TournamentDetailsSearcher } from "@/contexts/tournaments/tournament/application/search/TournamentDetailsSearcher";

const searcher = container.get(TournamentDetailsSearcher);

export async function GET(_request: Request, { params }: { params: { id: string } }): Promise<NextResponse> {
	try {
        const { id } = await params;
		const tournament = await searcher.run(id);

		if (!tournament) {
			return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
		}

		return NextResponse.json(tournament);
	} catch (error) {
		console.error("Error fetching tournament details:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
