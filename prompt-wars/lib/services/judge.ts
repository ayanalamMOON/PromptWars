// Judge Service — AI judge pipeline (Ollama / Groq)
// Phase 3: AI Integration Layer

import Groq from "groq-sdk";
import { VerdictSchema, type Verdict } from "../schemas/verdict.schema";

type Provider = "ollama" | "groq";

function getProvider(): Provider {
    const p = (process.env.INFERENCE_PROVIDER ?? "ollama").toLowerCase();
    if (p === "groq" || p === "ollama") return p;
    return "ollama";
}

/**
 * Judge prompt template — hardcoded, identical for every match.
 * Evaluation criteria:
 *   - Constraint Adherence (40%)
 *   - Logic & Correctness (35%)
 *   - Elegance & Efficiency (25%)
 */
function buildJudgePrompt(
    problem: string,
    outputA: string,
    outputB: string
): string {
    return `You are the official Prompt Wars judge for GLITCH Tech Fest 2026.

PROBLEM: ${problem}
OUTPUT A: ${outputA}
OUTPUT B: ${outputB}

Evaluate both outputs based on these criteria:
1. Constraint Adherence (40%) - Did the output follow ALL constraints in the problem?
2. Logic & Correctness (35%) - Is the output accurate, complete, and logically sound?
3. Elegance & Efficiency (25%) - Quality, clarity, and creativity relative to prompt complexity.

You MUST respond ONLY with valid JSON in this exact format (no markdown, no extra text):
{"winner":"A","score_a":82,"score_b":64,"justification":"Brief explanation of why the winner was chosen"}

The winner field MUST be either "A" or "B". Scores must be 0-100.`;
}

// ── Groq client ───────────────────────────────────────────────────────
let groqClient: Groq | null = null;

function getGroqClient(): Groq {
    if (!groqClient) {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) throw new Error("GROQ_API_KEY environment variable is not set");
        groqClient = new Groq({ apiKey });
    }
    return groqClient;
}

// ── Ollama (OpenAI-compatible /v1 endpoint) ───────────────────────────
function getOllamaBaseUrl(): string {
    return process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434";
}

async function ollamaChat(
    model: string,
    messages: { role: string; content: string }[],
    extraBody?: Record<string, unknown>
): Promise<string> {
    const url = `${getOllamaBaseUrl()}/v1/chat/completions`;
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, messages, ...extraBody }),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Ollama request failed (${res.status}): ${text}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
}

/**
 * Judges a match by sending both outputs to the Judge AI.
 * Provider is selected via INFERENCE_PROVIDER env var (ollama | groq).
 *
 * @returns Parsed verdict: { winner, score_a, score_b, justification }
 */
export async function judgeMatch(
    problem: string,
    outputA: string,
    outputB: string
): Promise<Verdict & { judgeModel: string }> {
    const provider = getProvider();
    const defaultModel =
        provider === "ollama" ? "llama3:latest" : "llama-3.3-70b-versatile";
    const model = process.env.FROZEN_MODEL || defaultModel;
    const prompt = buildJudgePrompt(problem, outputA, outputB);

    const systemMsg = "You are a strict JSON-only judge. Respond with valid JSON only.";
    let raw: string;

    if (provider === "ollama") {
        raw = await ollamaChat(model, [
            { role: "system", content: systemMsg },
            { role: "user", content: prompt },
        ], { temperature: 0.3, max_tokens: 512 });
    } else {
        const groq = getGroqClient();
        const completion = await groq.chat.completions.create({
            model,
            messages: [
                { role: "system" as const, content: systemMsg },
                { role: "user" as const, content: prompt },
            ],
            temperature: 0.3,
            max_tokens: 512,
            response_format: { type: "json_object" },
        });
        raw = completion.choices[0]?.message?.content ?? "{}";
    }

    const parsed = JSON.parse(raw);
    const verdict = VerdictSchema.parse(parsed);

    return { ...verdict, judgeModel: model };
}
