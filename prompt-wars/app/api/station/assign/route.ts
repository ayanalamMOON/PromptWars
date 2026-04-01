import { NextRequest, NextResponse } from "next/server";

// POST /api/station/assign — Admin assigns a player to a station
export async function POST(request: NextRequest) {
    // TODO: Validate admin auth
    // TODO: Parse { playerId, stationId } from body
    // TODO: Update station assignment in DB
    return NextResponse.json({ message: "Station assignment endpoint" });
}
