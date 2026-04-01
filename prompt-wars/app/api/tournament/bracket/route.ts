import { NextResponse } from "next/server";

// GET /api/tournament/bracket — Returns current bracket state
export async function GET() {
    // TODO: Query Tournament model for current bracket
    return NextResponse.json({ message: "Bracket state endpoint" });
}
