// Ollama integration for the Showcase App
// Uses the OpenAI-compatible /v1/chat/completions endpoint

import { z } from "zod";

const GENERATION_PARAMS = {
    temperature: 0.7,
    max_tokens: 1536,
    top_p: 0.9,
} as const;

const JUDGE_PARAMS = {
    temperature: 0.1,
    max_tokens: 700,
    top_p: 0.2,
} as const;

const STOP_WORDS = new Set([
    "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "have", "how", "if", "in",
    "into", "is", "it", "its", "of", "on", "or", "our", "that", "the", "their", "them", "then", "there",
    "these", "this", "those", "to", "up", "use", "using", "was", "were", "what", "when", "which", "who", "why",
    "will", "with", "you", "your", "can", "could", "should", "would", "must", "than", "also",
]);

const judgeResponseSchema = z.object({
    winner: z.enum(["A", "B"]).optional(),
    score_a: z.coerce.number(),
    score_b: z.coerce.number(),
    justification: z.string().optional(),
});

export interface JudgeCandidate {
    systemPrompt: string;
    userPrompt: string;
    output: string;
}

export interface JudgeVerdict {
    winner: "A" | "B";
    score_a: number;
    score_b: number;
    justification: string;
}

function getOllamaBaseUrl(): string {
    return process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434";
}

function getGenerationModel(): string {
    return process.env.GENERATION_MODEL ?? process.env.FROZEN_MODEL ?? "llama3:latest";
}

function getJudgeModel(): string {
    return process.env.JUDGE_MODEL ?? getGenerationModel();
}

export function getBattleModels(): { generationModel: string; judgeModel: string } {
    return {
        generationModel: getGenerationModel(),
        judgeModel: getJudgeModel(),
    };
}

function normalizeText(value: string): string {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function tokenize(value: string): string[] {
    return normalizeText(value)
        .split(" ")
        .filter((token) => token.length >= 3 && !STOP_WORDS.has(token));
}

function extractProblemKeywords(problem: string, maxKeywords = 16): string[] {
    const freq = new Map<string, number>();
    for (const token of tokenize(problem)) {
        freq.set(token, (freq.get(token) ?? 0) + 1);
    }

    return [...freq.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, maxKeywords)
        .map(([token]) => token);
}

function keywordCoverage(text: string, keywords: string[]): number {
    if (keywords.length === 0) return 0;

    const tokenSet = new Set(tokenize(text));
    const matched = keywords.filter((keyword) => tokenSet.has(keyword)).length;
    return matched / keywords.length;
}

function clampScore(value: number): number {
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, Math.min(100, Math.round(value)));
}

function extractJsonPayload(raw: string): string {
    const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced?.[1]) {
        return fenced[1].trim();
    }

    const firstBrace = raw.indexOf("{");
    const lastBrace = raw.lastIndexOf("}");
    if (firstBrace >= 0 && lastBrace > firstBrace) {
        return raw.slice(firstBrace, lastBrace + 1);
    }

    return raw.trim();
}

function computeLocalScore(problemKeywords: string[], candidate: JudgeCandidate) {
    const promptText = `${candidate.systemPrompt}\n${candidate.userPrompt}`;
    const promptCoverage = keywordCoverage(promptText, problemKeywords);
    const outputCoverage = keywordCoverage(candidate.output, problemKeywords);

    const promptComplexity = Math.min(1, tokenize(promptText).length / 40);
    const outputDepth = Math.min(1, tokenize(candidate.output).length / 180);

    const alignment = clampScore((promptCoverage * 0.55 + outputCoverage * 0.45) * 100);
    const quality = clampScore((promptComplexity * 0.35 + outputDepth * 0.65) * 100);

    let total = clampScore(alignment * 0.65 + quality * 0.35);

    // Hard anti-random penalties
    if (promptCoverage < 0.12) {
        total = Math.min(total, 25);
    } else if (promptCoverage < 0.2) {
        total = Math.min(total, 45);
    }

    if (outputCoverage < 0.1) {
        total = Math.min(total, 35);
    }

    return {
        promptCoverage,
        outputCoverage,
        alignment,
        quality,
        total,
    };
}

function fallbackVerdict(localA: ReturnType<typeof computeLocalScore>, localB: ReturnType<typeof computeLocalScore>): JudgeVerdict {
    const scoreA = clampScore(localA.total);
    const scoreB = clampScore(localB.total);
    const winner: "A" | "B" = scoreA >= scoreB ? "A" : "B";

    return {
        winner,
        score_a: scoreA,
        score_b: scoreB,
        justification:
            "Fallback verdict used: scoring prioritized problem alignment and penalized off-topic/random submissions.",
    };
}

async function ollamaChat(
    messages: { role: string; content: string }[],
    options?: {
        model?: string;
        params?: Record<string, unknown>;
    }
): Promise<string> {
    const url = `${getOllamaBaseUrl()}/v1/chat/completions`;
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: options?.model ?? getGenerationModel(),
            messages,
            ...options?.params,
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
            model: getGenerationModel(),
            params: {
                temperature: GENERATION_PARAMS.temperature,
                max_tokens: GENERATION_PARAMS.max_tokens,
                top_p: GENERATION_PARAMS.top_p,
            },
        }
    );
}

export async function judgeOutputs(
    problem: string,
    candidateA: JudgeCandidate,
    candidateB: JudgeCandidate
): Promise<JudgeVerdict> {
    const problemKeywords = extractProblemKeywords(problem);
    const localA = computeLocalScore(problemKeywords, candidateA);
    const localB = computeLocalScore(problemKeywords, candidateB);

    const judgePrompt = `You are the official Prompt Wars judge for GLITCH Tech Fest 2026.

PROBLEM: ${problem}

PARTICIPANT A PROMPTS:
SYSTEM:
${candidateA.systemPrompt}
USER:
${candidateA.userPrompt}

OUTPUT A:
${candidateA.output}

PARTICIPANT B PROMPTS:
SYSTEM:
${candidateB.systemPrompt}
USER:
${candidateB.userPrompt}

OUTPUT B:
${candidateB.output}

LOCAL ALIGNMENT SIGNALS (for consistency checking):
- A prompt keyword coverage: ${(localA.promptCoverage * 100).toFixed(1)}%
- B prompt keyword coverage: ${(localB.promptCoverage * 100).toFixed(1)}%
- A output keyword coverage: ${(localA.outputCoverage * 100).toFixed(1)}%
- B output keyword coverage: ${(localB.outputCoverage * 100).toFixed(1)}%

Evaluate both outputs based on these criteria:
1. Problem Alignment (45%) - Do the submitted prompts and generated outputs clearly address the given problem statement and its constraints?
2. Logic & Correctness (35%) - Is the output accurate, complete, and logically sound?
3. Quality & Clarity (20%) - Is the response well-structured, useful, and coherent?

RULES:
- You MUST pick a winner. The winner field MUST be exactly "A" or "B".
- Even if both outputs are poor, pick whichever is relatively better.
- Scores must be integers from 0 to 100.
- If a participant prompt is generic/off-topic/random or not tied to the problem, score must be heavily penalized.
- If a participant clearly does not address the problem, cap score <= 25.

Respond ONLY with valid JSON in this exact format (no markdown, no extra text):
{"winner":"A","score_a":82,"score_b":64,"justification":"Brief explanation of why the winner was chosen"}`;

    try {
        const raw = await ollamaChat(
            [
                { role: "system", content: "You are a strict JSON-only judge. Respond with valid JSON only." },
                { role: "user", content: judgePrompt },
            ],
            {
                model: getJudgeModel(),
                params: {
                    temperature: JUDGE_PARAMS.temperature,
                    max_tokens: JUDGE_PARAMS.max_tokens,
                    top_p: JUDGE_PARAMS.top_p,
                },
            }
        );

        const jsonPayload = extractJsonPayload(raw);
        const parsedUnknown = JSON.parse(jsonPayload);
        const parsed = judgeResponseSchema.parse(parsedUnknown);

        // Blend LLM + deterministic anti-random score.
        let scoreA = clampScore(parsed.score_a * 0.45 + localA.total * 0.55);
        let scoreB = clampScore(parsed.score_b * 0.45 + localB.total * 0.55);

        // Enforce hard caps if prompt/output is off-topic.
        if (localA.promptCoverage < 0.12 || localA.outputCoverage < 0.1) {
            scoreA = Math.min(scoreA, 25);
        }
        if (localB.promptCoverage < 0.12 || localB.outputCoverage < 0.1) {
            scoreB = Math.min(scoreB, 25);
        }

        let winner: "A" | "B";
        if (scoreA === scoreB) {
            winner = localA.promptCoverage >= localB.promptCoverage ? "A" : "B";
        } else {
            winner = scoreA > scoreB ? "A" : "B";
        }

        if (parsed.winner === "A" || parsed.winner === "B") {
            const llmWinner = parsed.winner;
            const llmGapAgrees = llmWinner === winner || Math.abs(scoreA - scoreB) <= 5;
            if (!llmGapAgrees) {
                winner = scoreA >= scoreB ? "A" : "B";
            }
        }

        return {
            winner,
            score_a: scoreA,
            score_b: scoreB,
            justification:
                parsed.justification?.trim() ||
                "Judging completed with strict problem-alignment checks and anti-random penalties.",
        };
    } catch {
        return fallbackVerdict(localA, localB);
    }
}
