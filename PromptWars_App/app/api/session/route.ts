import {
    beginPromptingPhase,
    createSession,
    enforcePromptDeadline,
    getSession,
    normalizePromptTimeLimitSeconds,
    resetSession,
    updateSession,
} from "@/lib/gameState";
import { getBattleModels } from "@/lib/ollama";
import { FIELDS, getRandomProblem, type FieldSelection } from "@/lib/problems";
import { NextRequest, NextResponse } from "next/server";

// GET /api/session — return current session
export async function GET() {
    const session = enforcePromptDeadline() ?? getSession();
    return NextResponse.json({ session });
}

// POST /api/session — create a new session
export async function POST(req: NextRequest) {
    const existing = getSession();
    if (existing) {
        return NextResponse.json(
            { error: "A session already exists. Reset before creating a new one." },
            { status: 409 }
        );
    }

    let problem: string;
    let field: FieldSelection = "mix";
    let promptTimeLimitSeconds = normalizePromptTimeLimitSeconds(undefined);
    try {
        const body = await req.json();

        if (typeof body.field === "string") {
            const f = body.field as string;
            if (f === "mix" || (FIELDS as readonly string[]).includes(f)) {
                field = f as FieldSelection;
            }
        }

        problem = typeof body.problem === "string" && body.problem.trim()
            ? body.problem.trim()
            : getRandomProblem(field);

        promptTimeLimitSeconds = normalizePromptTimeLimitSeconds(body.promptTimeLimitSeconds);
    } catch {
        problem = getRandomProblem(field);
    }

    const session = createSession(problem, field, promptTimeLimitSeconds);
    const { generationModel, judgeModel } = getBattleModels();
    session.generationModel = generationModel;
    session.judgeModel = judgeModel;
    return NextResponse.json({ session }, { status: 201 });
}

// PATCH /api/session — update session (join, change status)
export async function PATCH(req: NextRequest) {
    const session = enforcePromptDeadline() ?? getSession();
    if (!session) {
        return NextResponse.json({ error: "No active session" }, { status: 404 });
    }

    const body = await req.json();

    // Participant joining
    if (body.join === "A" || body.join === "B") {
        const key = body.join === "A" ? "participantA" : "participantB";
        const participant = session[key];
        participant.connected = true;
        participant.name = typeof body.name === "string" ? body.name.slice(0, 30) : `Player ${body.join}`;
        return NextResponse.json({ session });
    }

    if (typeof body.promptTimeLimitSeconds !== "undefined") {
        if (session.status !== "lobby") {
            return NextResponse.json(
                { error: "Timer can only be adjusted before the battle starts." },
                { status: 400 }
            );
        }

        updateSession({
            promptTimeLimitSeconds: normalizePromptTimeLimitSeconds(body.promptTimeLimitSeconds),
        });
        return NextResponse.json({ session: getSession() });
    }

    // Status change
    if (body.status) {
        const validTransitions: Record<string, string[]> = {
            lobby: ["prompting"],
            prompting: ["executing"],
            executing: ["judging"],
            judging: ["complete"],
        };
        const allowed = validTransitions[session.status] ?? [];
        if (!allowed.includes(body.status)) {
            return NextResponse.json(
                { error: `Cannot transition from ${session.status} to ${body.status}` },
                { status: 400 }
            );
        }
        if (body.status === "prompting") {
            const updatedSession = beginPromptingPhase();
            return NextResponse.json({ session: updatedSession });
        }

        updateSession({ status: body.status });
        return NextResponse.json({ session: getSession() });
    }

    return NextResponse.json({ error: "Invalid patch" }, { status: 400 });
}

// DELETE /api/session — reset/destroy session
export async function DELETE() {
    resetSession();
    return NextResponse.json({ ok: true });
}
