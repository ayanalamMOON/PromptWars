import { NextRequest, NextResponse } from "next/server";

// POST /api/station/checkin — Check in a player to a station, sets iron-session cookie
export async function POST(request: NextRequest) {
    // TODO: Parse { playerId, stationId } from body
    // TODO: Set iron-session cookie with player/station info
    // TODO: Update player isCheckedIn status in DB
    return NextResponse.json({ message: "Station check-in endpoint" });
}
