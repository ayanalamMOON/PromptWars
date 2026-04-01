import { NextRequest, NextResponse } from "next/server";

// GET /api/analytics/export — Export full tournament data as JSON (or CSV via ?format=csv)
export async function GET(request: NextRequest) {
    // TODO: Validate admin auth
    // TODO: Query all matches, prompts, outputs, verdicts
    // TODO: Check for ?format=csv query param to optionally return CSV
    return NextResponse.json({ message: "Analytics export endpoint" });
}
