import { NextRequest, NextResponse } from "next/server";

// POST /api/tournament/generate — Generate bracket from player IDs
export async function POST(request: NextRequest) {
    // TODO: Parse player IDs from body
    // TODO: Call generateBracket() from tournament service
    // TODO: Save bracket to Tournament model
    return NextResponse.json({ message: "Bracket generation endpoint" });
}
