import { NextResponse } from "next/server";

// GET /api/leaderboard — Returns current standings
export async function GET() {
    // TODO: Query active players, ranked by wins and average score
    // TODO: Include elimination status
    return NextResponse.json({ message: "Leaderboard endpoint" });
}
