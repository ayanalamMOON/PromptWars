import { NextRequest, NextResponse } from "next/server";

// POST /api/admin/problem/reveal — Reveal a problem to active match rooms
export async function POST(request: NextRequest) {
    // TODO: Validate admin auth
    // TODO: Parse { problemId, matchIds } from body
    // TODO: Update Problem.isRevealed = true
    // TODO: Publish problem:reveal event via Redis pub/sub to all active match rooms
    return NextResponse.json({ message: "Problem reveal endpoint" });
}
