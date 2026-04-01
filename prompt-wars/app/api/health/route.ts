import { NextResponse } from "next/server";

export async function GET() {
    // TODO: Add DB ping and Redis ping checks
    return NextResponse.json({
        status: "ok",
        timestamp: new Date().toISOString(),
    });
}
