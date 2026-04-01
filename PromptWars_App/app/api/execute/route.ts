import { enforcePromptDeadline, getSession, updateSession } from "@/lib/gameState";
import { getBattleModels, judgeOutputs, runBattlePrompt } from "@/lib/ollama";
import { saveSessionToDisk } from "@/lib/sessionStore";
import { NextResponse } from "next/server";

// POST /api/execute — master triggers AI execution and judging
export async function POST() {
    const session = enforcePromptDeadline() ?? getSession();
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

    if (!session.generationModel || !session.judgeModel) {
        const { generationModel, judgeModel } = getBattleModels();
        updateSession({ generationModel, judgeModel });
    }

    updateSession({ status: "executing" });

    try {
        const [outputA, outputB] = await Promise.all([
            runBattlePrompt(session.participantA.systemPrompt, session.participantA.userPrompt),
            runBattlePrompt(session.participantB.systemPrompt, session.participantB.userPrompt),
        ]);

        updateSession({ outputA, outputB, status: "judging" });

        const verdict = await judgeOutputs(
            session.problem,
            {
                systemPrompt: session.participantA.systemPrompt,
                userPrompt: session.participantA.userPrompt,
                output: outputA,
            },
            {
                systemPrompt: session.participantB.systemPrompt,
                userPrompt: session.participantB.userPrompt,
                output: outputB,
            }
        );
        updateSession({ verdict, status: "complete" });

        // Auto-save the completed battle to disk
        saveSessionToDisk(session);

        return NextResponse.json({ session: getSession() });
    } catch (err: unknown) {
        updateSession({ status: "prompting" });
        const message = err instanceof Error ? err.message : "Execution failed";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
