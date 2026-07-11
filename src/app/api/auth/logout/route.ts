import "reflect-metadata";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { HttpNextResponse } from "@/contexts/shared/infrastructure/http/HttpNextResponse";

export async function POST(): Promise<NextResponse> {
	(await cookies()).delete("session");
	return HttpNextResponse.json({ message: "Sesión cerrada" });
}
