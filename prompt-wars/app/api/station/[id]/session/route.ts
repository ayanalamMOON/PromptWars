import { NextRequest, NextResponse } from "next/server";

// GET /api/station/[id]/session — Returns current player assigned to this station
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    // TODO: Read iron-session cookie or query DB for station assignment
    // TODO: Return player info or { assigned: false }
    return NextResponse.json({
        stationId: params.id,
        assigned: false,
        message: "Station session endpoint",
    });
}
