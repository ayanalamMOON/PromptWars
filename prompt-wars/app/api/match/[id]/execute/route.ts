import { NextRequest, NextResponse } from "next/server";

// POST /api/match/[id]/execute — Run both prompts simultaneously
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    // TODO: Admin-only or timer-triggered
    // TODO: Fetch both submitted prompts from Match document
    // TODO: Call inference.runPrompt() for both players simultaneously
    // TODO: Stream outputs via Redis pub/sub to WebSocket server
    // TODO: Save outputs to Match document
    return NextResponse.json({
        matchId: params.id,
        message: "Execution endpoint",
    });
}
