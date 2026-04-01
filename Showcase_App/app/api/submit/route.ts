import { getSession, updateSession } from "@/lib/gameState";
import { judgeOutputs, runBattlePrompt } from "@/lib/ollama";
import { checkPrompt } from "@/lib/promptGuard";
import { NextRequest, NextResponse } from "next/server";

// Automatically execute prompts and judge once both participants have submitted
async function autoExecuteAndJudge() {
    const session = getSession();
    if (!session || session.status !== "prompting") return;
    if (!session.participantA.submitted || !session.participantB.submitted) return;

    updateSession({ status: "executing" });

    try {
        const [outputA, outputB] = await Promise.all([
            runBattlePrompt(session.participantA.systemPrompt, session.participantA.userPrompt),
            runBattlePrompt(session.participantB.systemPrompt, session.participantB.userPrompt),
        ]);

        updateSession({ outputA, outputB, status: "judging" });

        const verdict = await judgeOutputs(session.problem, outputA, outputB);
        updateSession({ verdict, status: "complete" });
    } catch {
        // Revert to prompting so participants can retry
        updateSession({ status: "prompting" });
    }
}

// POST /api/submit — participant submits their prompts
export async function POST(req: NextRequest) {
    const session = getSession();
    if (!session) {
        return NextResponse.json({ error: "No active session" }, { status: 404 });
    }

    if (session.status !== "prompting") {
        return NextResponse.json(
            { error: "Session is not in prompting phase" },
            { status: 400 }
        );
    }

    const body = await req.json();
    const role = body.role;
    if (role !== "A" && role !== "B") {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const systemPrompt = typeof body.systemPrompt === "string" ? body.systemPrompt.trim() : "";
    const userPrompt = typeof body.userPrompt === "string" ? body.userPrompt.trim() : "";

    if (!systemPrompt || !userPrompt) {
        return NextResponse.json(
            { error: "Both systemPrompt and userPrompt are required" },
            { status: 400 }
        );
    }

    // ── Prompt injection / manipulation guard ──────────────────────────
    const guard = checkPrompt(systemPrompt, userPrompt);
    if (guard.flagged) {
        const cheater = role;
        const winner = cheater === "A" ? "B" : "A";

        // Record the prompts so the master can see what happened
        const key = role === "A" ? "participantA" : "participantB";
        session[key].systemPrompt = systemPrompt;
        session[key].userPrompt = userPrompt;
        session[key].submitted = true;

        updateSession({
            status: "complete",
            verdict: {
                winner,
                score_a: cheater === "A" ? 0 : 100,
                score_b: cheater === "B" ? 0 : 100,
                justification: `Participant ${cheater} was DISQUALIFIED: ${guard.reason}. Participant ${winner} wins by default.`,
            },
        });

        return NextResponse.json({
            session: getSession(),
            disqualified: true,
            reason: guard.reason,
        });
    }

    const key = role === "A" ? "participantA" : "participantB";
    session[key].systemPrompt = systemPrompt;
    session[key].userPrompt = userPrompt;
    session[key].submitted = true;

    // If both have submitted, fire off execution + judging automatically
    if (session.participantA.submitted && session.participantB.submitted) {
        // Fire-and-forget — don't block the response
        autoExecuteAndJudge();
    }

    return NextResponse.json({ session });
}
