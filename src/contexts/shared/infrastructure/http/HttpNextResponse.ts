import { NextResponse } from "next/server";

export class HttpNextResponse {
	static json(data: unknown, status = 200): NextResponse {
		return NextResponse.json(data, { status });
	}
}
