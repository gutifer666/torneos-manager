import "reflect-metadata";

import { NextResponse } from "next/server";
import { container } from "@/contexts/shared/infrastructure/dependency-injection/diod.config";
import { MatchResultUpdater } from "@/contexts/tournaments/tournament/application/update-match/MatchResultUpdater";

const updater = container.get(MatchResultUpdater);

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string; matchId: string }> }
): Promise<NextResponse> {
	try {
		const { id, matchId } = await params;
		const body = await request.json();
		const { localScore, visitorScore } = body;

		if (localScore === undefined || visitorScore === undefined) {
			return NextResponse.json({ error: "Missing scores" }, { status: 400 });
		}

		await updater.run(id, matchId, Number(localScore), Number(visitorScore));

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error updating match result:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
