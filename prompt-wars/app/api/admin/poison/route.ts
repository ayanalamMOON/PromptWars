import { NextRequest, NextResponse } from "next/server";

// POST /api/admin/poison — Inject a poison pill constraint into active matches
export async function POST(request: NextRequest) {
    // TODO: Validate admin auth
    // TODO: Only allowed from Quarterfinals onwards
    // TODO: Parse { matchIds, constraint } from body
    // TODO: Publish poison:inject event via Redis pub/sub to target match rooms
    return NextResponse.json({ message: "Poison pill injection endpoint" });
}
