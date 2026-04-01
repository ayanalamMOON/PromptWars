import { getSession, isMasterConnected, pingMaster } from "@/lib/gameState";
import { NextRequest, NextResponse } from "next/server";

// GET /api/status — lightweight poll for game state
export async function GET(req: NextRequest) {
    // If ?heartbeat=master is present, treat as a master heartbeat
    if (req.nextUrl.searchParams.get("heartbeat") === "master") {
        pingMaster();
    }
    const session = getSession();
    return NextResponse.json({ session, masterConnected: isMasterConnected() });
}
