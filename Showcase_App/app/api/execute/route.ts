import { getSession, updateSession } from "@/lib/gameState";
import { judgeOutputs, runBattlePrompt } from "@/lib/ollama";
import { NextResponse } from "next/server";

// POST /api/execute — master triggers AI execution and judging
export async function POST() {
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

    if (!session.participantA.submitted || !session.participantB.submitted) {
        return NextResponse.json(
            { error: "Both participants must submit before executing" },
            { status: 400 }
        );
    }

    // Phase 1: Execute prompts
    updateSession({ status: "executing" });

    try {
        const [outputA, outputB] = await Promise.all([
            runBattlePrompt(session.participantA.systemPrompt, session.participantA.userPrompt),
            runBattlePrompt(session.participantB.systemPrompt, session.participantB.userPrompt),
        ]);

        updateSession({ outputA, outputB, status: "judging" });

        // Phase 2: Judge
        const verdict = await judgeOutputs(session.problem, outputA, outputB);
        updateSession({ verdict, status: "complete" });

        return NextResponse.json({ session: getSession() });
    } catch (err: unknown) {
        // Revert to prompting so master can retry
        updateSession({ status: "prompting" });
        const message = err instanceof Error ? err.message : "Execution failed";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
