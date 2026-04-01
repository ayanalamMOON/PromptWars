import { NextRequest, NextResponse } from "next/server";

// GET /api/match/[id] — Get match details
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    // TODO: Query Match model by id
    // TODO: Return match details (players, status, phase, problem, outputs, verdict)
    return NextResponse.json({
        matchId: params.id,
        message: "Match details endpoint",
    });
}
