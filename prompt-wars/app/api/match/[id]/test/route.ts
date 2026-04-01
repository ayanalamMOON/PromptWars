import { NextRequest, NextResponse } from "next/server";

// POST /api/match/[id]/test — Test run a prompt (max 5 per match)
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    // TODO: Validate session
    // TODO: Check Redis rate limit (ratelimit:{userId}:{matchId}, max 5)
    // TODO: Call inference.runPrompt() with frozen parameters
    // TODO: Return AI output (non-streamed for test runs)
    return NextResponse.json({
        matchId: params.id,
        message: "Test run endpoint",
    });
}
