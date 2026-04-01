import { NextRequest, NextResponse } from "next/server";

// POST /api/match/[id]/submit — Submit final prompt for a match
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    // TODO: Validate session — only the assigned player can submit
    // TODO: Parse { systemPrompt, userPrompt } from body
    // TODO: Save submission to Match document
    // TODO: Lock further edits for this player
    return NextResponse.json({
        matchId: params.id,
        message: "Prompt submission endpoint",
    });
}
