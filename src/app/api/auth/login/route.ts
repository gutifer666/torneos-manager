import "reflect-metadata";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { container } from "@/contexts/shared/infrastructure/dependency-injection/diod.config";
import { Authenticator } from "@/contexts/auth/user/application/Authenticator";
import { HttpNextResponse } from "@/contexts/shared/infrastructure/http/HttpNextResponse";

export async function POST(request: Request): Promise<NextResponse> {
	try {
		const { username, password } = await request.json();
		const authenticator = container.get(Authenticator);

		const user = await authenticator.authenticate(username, password);

		if (!user) {
			return HttpNextResponse.json({ error: "Credenciales inválidas" }, 401);
		}

		const primitives = user.toPrimitives();
		
		(await cookies()).set("session", primitives.id, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
		});

		return HttpNextResponse.json({ 
			id: primitives.id,
			username: primitives.username,
			role: primitives.role 
		});
	} catch (error) {
		return HttpNextResponse.json({ error: (error as Error).message }, 400);
	}
}
