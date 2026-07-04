import "reflect-metadata";
import { NextResponse } from "next/server";
import { container } from "@/contexts/shared/infrastructure/dependency-injection/diod.config";
import { SubmitMatchReport } from "@/contexts/matches/match-reports/application/submit/SubmitMatchReport";

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
	try {
		const useCase = container.get(SubmitMatchReport);
		const { id: matchId } = await params;
		const body = await request.json();
		
		await useCase.run({
			id: body.id || crypto.randomUUID(),
			matchId,
			tournamentId: body.tournamentId,
			refereeId: body.refereeId,
			actualStartTime: new Date(body.actualStartTime),
			assistantNames: body.assistantNames,
			lineups: body.lineups,
			incidents: body.incidents,
			extraordinaryIncidents: body.extraordinaryIncidents,
			refereeSignature: body.refereeSignature,
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error submitting match report:", error);
		const message = error instanceof Error ? error.message : "Internal Server Error";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
