import { enforcePromptDeadline, getSession, updateSession } from "@/lib/gameState";
import { getBattleModels, judgeOutputs, runBattlePrompt } from "@/lib/ollama";
import { checkProblemRelevance, checkPrompt } from "@/lib/promptGuard";
import { saveSessionToDisk } from "@/lib/sessionStore";
import { NextRequest, NextResponse } from "next/server";

// Automatically execute prompts and judge once both participants have submitted
async function autoExecuteAndJudge() {
    const session = enforcePromptDeadline() ?? getSession();
    if (!session || session.status !== "prompting") return;
    if (!session.participantA.submitted || !session.participantB.submitted) return;

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
    } catch {
        updateSession({ status: "prompting" });
    }
}

// POST /api/submit — participant submits their prompts
export async function POST(req: NextRequest) {
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

    const currentSession = enforcePromptDeadline() ?? getSession();
    if (!currentSession || currentSession.status !== "prompting") {
        return NextResponse.json(
            {
                error: "The submission window has closed.",
                session: currentSession,
            },
            { status: 409 }
        );
    }

    if (!currentSession.generationModel || !currentSession.judgeModel) {
        const { generationModel, judgeModel } = getBattleModels();
        updateSession({ generationModel, judgeModel });
    }

    // Prompt injection / manipulation guard
    const guard = checkPrompt(systemPrompt, userPrompt);
    if (guard.flagged) {
        const cheater = role;
        const winner = cheater === "A" ? "B" : "A";

        const key = role === "A" ? "participantA" : "participantB";
        currentSession[key].systemPrompt = systemPrompt;
        currentSession[key].userPrompt = userPrompt;
        currentSession[key].submitted = true;

        updateSession({
            status: "complete",
            verdict: {
                winner,
                score_a: cheater === "A" ? 0 : 100,
                score_b: cheater === "B" ? 0 : 100,
                justification: `Participant ${cheater} was DISQUALIFIED: ${guard.reason}. Participant ${winner} wins by default.`,
            },
        });

        // Save disqualification record
        saveSessionToDisk(currentSession);

        return NextResponse.json({
            session: getSession(),
            disqualified: true,
            reason: guard.reason,
        });
    }

    // Problem relevance guard: reject clearly random/off-topic prompts.
    const relevance = checkProblemRelevance(currentSession.problem, systemPrompt, userPrompt);
    if (relevance.flagged) {
        const cheater = role;
        const winner = cheater === "A" ? "B" : "A";

        const key = role === "A" ? "participantA" : "participantB";
        currentSession[key].systemPrompt = systemPrompt;
        currentSession[key].userPrompt = userPrompt;
        currentSession[key].submitted = true;

        updateSession({
            status: "complete",
            verdict: {
                winner,
                score_a: cheater === "A" ? 0 : 100,
                score_b: cheater === "B" ? 0 : 100,
                justification: `Participant ${cheater} was DISQUALIFIED for off-topic/random prompt submission: ${relevance.reason} (relevance score: ${relevance.score}/100). Participant ${winner} wins by default.`,
            },
        });

        saveSessionToDisk(currentSession);

        return NextResponse.json({
            session: getSession(),
            disqualified: true,
            reason: `${relevance.reason} Relevance score: ${relevance.score}/100.`,
        });
    }

    const key = role === "A" ? "participantA" : "participantB";
    currentSession[key].systemPrompt = systemPrompt;
    currentSession[key].userPrompt = userPrompt;
    currentSession[key].submitted = true;

    // If both have submitted, fire off execution + judging automatically
    if (currentSession.participantA.submitted && currentSession.participantB.submitted) {
        autoExecuteAndJudge();
    }

    return NextResponse.json({ session: currentSession });
}
