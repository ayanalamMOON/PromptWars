import { enforcePromptDeadline, getSession, isMasterConnected, pingMaster } from "@/lib/gameState";
import { NextRequest, NextResponse } from "next/server";

// GET /api/status — lightweight poll for game state
export async function GET(req: NextRequest) {
    if (req.nextUrl.searchParams.get("heartbeat") === "master") {
        pingMaster();
    }
    const session = enforcePromptDeadline() ?? getSession();
    return NextResponse.json({ session, masterConnected: isMasterConnected() });
}
