import { NextRequest, NextResponse } from "next/server";

// POST /api/admin/problem — Add a problem to the bank
export async function POST(request: NextRequest) {
    // TODO: Validate admin auth
    // TODO: Parse { round, title, statement, constraints, poisonPill, difficulty }
    // TODO: Save to Problem model
    return NextResponse.json({ message: "Problem creation endpoint" });
}

// GET /api/admin/problem — List all problems
export async function GET() {
    // TODO: Validate admin auth
    // TODO: Return all problems from Problem model
    return NextResponse.json({ message: "Problem list endpoint" });
}
