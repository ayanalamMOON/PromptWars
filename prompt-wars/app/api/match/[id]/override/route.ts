import { NextRequest, NextResponse } from "next/server";

// POST /api/match/[id]/override — Admin override match verdict
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    // TODO: Validate admin auth
    // TODO: Parse { winnerId, reason } from body
    // TODO: Update Match verdict with override flag
    // TODO: Recalculate bracket via tournament.advanceWinner()
    // TODO: Broadcast bracket:update via Redis pub/sub
    return NextResponse.json({
        matchId: params.id,
        message: "Admin override endpoint",
    });
}
