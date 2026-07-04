import "reflect-metadata";
import { NextResponse } from "next/server";
import { container } from "@/contexts/shared/infrastructure/dependency-injection/diod.config";
import { TournamentRepository } from "@/contexts/tournaments/tournament/domain/TournamentRepository";

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
	try {
		const repository = container.get(TournamentRepository);
		const { id: matchId } = await params;
		
		const tournaments = await repository.searchAll();
		let foundMatch = null;
		let foundTournament = null;

		for (const tournament of tournaments) {
			const primitives = tournament.toPrimitives();
			const match = primitives.matches?.find(m => m.id === matchId);
			if (match) {
				foundMatch = match;
				foundTournament = primitives;
				break;
			}
		}

		if (!foundMatch) {
			return NextResponse.json({ error: "Match not found" }, { status: 404 });
		}

		return NextResponse.json({
			match: foundMatch,
			tournament: {
				id: foundTournament!.id,
				name: foundTournament!.name,
				category: foundTournament!.category,
			}
		});
	} catch (error) {
		console.error("Error fetching match details:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
