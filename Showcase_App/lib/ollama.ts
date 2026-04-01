// Ollama integration for the Showcase App
// Uses the OpenAI-compatible /v1/chat/completions endpoint

const FROZEN_PARAMS = {
    temperature: 0.7,
    max_tokens: 2048,
    top_p: 0.9,
} as const;

function getOllamaBaseUrl(): string {
    return process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434";
}

function getModel(): string {
    return process.env.FROZEN_MODEL ?? "llama3:latest";
}

async function ollamaChat(
    messages: { role: string; content: string }[],
    extraParams?: Record<string, unknown>
): Promise<string> {
    const url = `${getOllamaBaseUrl()}/v1/chat/completions`;
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: getModel(),
            messages,
            ...extraParams,
        }),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Ollama request failed (${res.status}): ${text}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
}

export async function runBattlePrompt(
    systemPrompt: string,
    userPrompt: string
): Promise<string> {
    return ollamaChat(
        [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
        ],
        {
            temperature: FROZEN_PARAMS.temperature,
            max_tokens: FROZEN_PARAMS.max_tokens,
            top_p: FROZEN_PARAMS.top_p,
        }
    );
}

export async function judgeOutputs(
    problem: string,
    outputA: string,
    outputB: string
): Promise<{ winner: "A" | "B"; score_a: number; score_b: number; justification: string }> {
    const judgePrompt = `You are the official Prompt Wars judge for GLITCH Tech Fest 2026.

PROBLEM: ${problem}

OUTPUT A:
${outputA}

OUTPUT B:
${outputB}

Evaluate both outputs based on these criteria:
1. Constraint Adherence (40%) - Did the output follow ALL constraints in the problem?
2. Logic & Correctness (35%) - Is the output accurate, complete, and logically sound?
3. Elegance & Efficiency (25%) - Quality, clarity, and creativity relative to prompt complexity.

RULES:
- You MUST pick a winner. The winner field MUST be exactly "A" or "B".
- Even if both outputs are poor, pick whichever is relatively better.
- Scores must be integers from 0 to 100.

Respond ONLY with valid JSON in this exact format (no markdown, no extra text):
{"winner":"A","score_a":82,"score_b":64,"justification":"Brief explanation of why the winner was chosen"}`;

    const raw = await ollamaChat(
        [
            { role: "system", content: "You are a strict JSON-only judge. Respond with valid JSON only." },
            { role: "user", content: judgePrompt },
        ],
        { temperature: 0.3, max_tokens: 512 }
    );

    const parsed = JSON.parse(raw);
    if (parsed.winner !== "A" && parsed.winner !== "B") {
        parsed.winner = (parsed.score_a ?? 0) >= (parsed.score_b ?? 0) ? "A" : "B";
    }
    return {
        winner: parsed.winner,
        score_a: parsed.score_a ?? 0,
        score_b: parsed.score_b ?? 0,
        justification: parsed.justification ?? "No justification provided.",
    };
}
