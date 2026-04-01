// Inference Service — multi-provider (Ollama / Groq) with frozen parameters
// Phase 3: AI Integration Layer

import Groq from "groq-sdk";

type Provider = "ollama" | "groq";

const FROZEN_PARAMS = {
    temperature: 0.7,
    max_tokens: 2048,
    top_p: 0.9,
} as const;

function getProvider(): Provider {
    const p = (process.env.INFERENCE_PROVIDER ?? "ollama").toLowerCase();
    if (p === "groq" || p === "ollama") return p;
    return "ollama";
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
    extraBody?: Record<string, unknown>,
    signal?: AbortSignal
): Promise<string> {
    const url = `${getOllamaBaseUrl()}/v1/chat/completions`;
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, messages, ...extraBody }),
        signal,
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Ollama request failed (${res.status}): ${text}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
}

/**
 * Runs a prompt through the Battle AI.
 * Provider is selected via INFERENCE_PROVIDER env var (ollama | groq).
 * Parameters are frozen — identical for every participant in every match.
 */
export async function runPrompt(
    systemPrompt: string,
    userPrompt: string,
    options?: {
        stream?: boolean;
        matchId?: string;
        userId?: string;
    }
): Promise<{ output: string; model: string; params: typeof FROZEN_PARAMS }> {
    const provider = getProvider();
    const defaultModel =
        provider === "ollama" ? "llama3:latest" : "llama-3.3-70b-versatile";
    const model = process.env.FROZEN_MODEL || defaultModel;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120_000);

    try {
        const messages = [
            { role: "system" as const, content: systemPrompt },
            { role: "user" as const, content: userPrompt },
        ];

        let output: string;

        if (provider === "ollama") {
            output = await ollamaChat(
                model,
                messages,
                { temperature: FROZEN_PARAMS.temperature, max_tokens: FROZEN_PARAMS.max_tokens, top_p: FROZEN_PARAMS.top_p },
                controller.signal
            );
        } else {
            const groq = getGroqClient();
            const completion = await groq.chat.completions.create(
                { model, messages, ...FROZEN_PARAMS },
                { signal: controller.signal }
            );
            output = completion.choices[0]?.message?.content ?? "";
        }

        return { output, model, params: FROZEN_PARAMS };
    } finally {
        clearTimeout(timeout);
    }
}
