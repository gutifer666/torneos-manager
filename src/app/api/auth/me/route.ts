import "reflect-metadata";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { container } from "@/contexts/shared/infrastructure/dependency-injection/diod.config";
import { UserFinder } from "@/contexts/auth/user/application/UserFinder";
import { HttpNextResponse } from "@/contexts/shared/infrastructure/http/HttpNextResponse";

export async function GET(): Promise<NextResponse> {
	try {
		const session = (await cookies()).get("session");

		if (!session) {
			return HttpNextResponse.json({ user: null });
		}

		const finder = container.get(UserFinder);
		const user = await finder.find(session.value);

		if (!user) {
			return HttpNextResponse.json({ user: null });
		}

		const primitives = user.toPrimitives();
		return HttpNextResponse.json({
			user: {
				id: primitives.id,
				username: primitives.username,
				role: primitives.role,
			},
		});
	} catch (error) {
		return HttpNextResponse.json({ error: (error as Error).message }, 500);
	}
}
