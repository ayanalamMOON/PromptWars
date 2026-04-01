import { NextRequest, NextResponse } from "next/server";

// POST /api/match/[id]/judge — Trigger AI judge evaluation
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    // TODO: Fetch match problem, outputA, outputB
    // TODO: Call judge.judgeMatch(problem, outputA, outputB)
    // TODO: Save verdict to Match document
    // TODO: Publish verdict:announce via Redis pub/sub
    // TODO: Call tournament.advanceWinner() to update bracket
    return NextResponse.json({
        matchId: params.id,
        message: "Judge evaluation endpoint",
    });
}
