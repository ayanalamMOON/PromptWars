#!/usr/bin/env node
/**
 * PromptWars CLI Showcase
 *
 * Demonstrates the core tournament mechanic:
 * 1. Two players submit prompts (system + user)
 * 2. Both prompts are executed against the same frozen AI model
 * 3. An AI judge evaluates both outputs and declares a winner
 *
 * Usage:
 *   npx tsx scripts/showcase.ts
 *
 * Supports Ollama (default) and Groq providers via INFERENCE_PROVIDER env var.
 * No database or Redis required.
 */

import { config } from "dotenv";
import * as readline from "readline";

// Load environment variables from .env
config();

import Groq from "groq-sdk";

type Provider = "ollama" | "groq";

// ── Frozen battle parameters (same for every participant) ─────────────
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

const PROVIDER = getProvider();
const DEFAULT_MODEL = PROVIDER === "ollama" ? "llama3:latest" : "llama-3.3-70b-versatile";
const MODEL = process.env.FROZEN_MODEL || DEFAULT_MODEL;

// ── Groq client ───────────────────────────────────────────────────────
function createGroqClient(): Groq {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        console.error("ERROR: GROQ_API_KEY is not set in your .env file.");
        process.exit(1);
    }
    return new Groq({ apiKey });
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

// ── Prompt helpers ────────────────────────────────────────────────────
function createReadlineInterface() {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
}

function ask(rl: readline.Interface, question: string): Promise<string> {
    return new Promise((resolve, reject) => {
        rl.question(question, (answer: string) => resolve(answer.trim()));
        rl.once("close", () => reject(new Error("Input stream closed")));
    });
}

/** Read all stdin lines upfront (for piped input). */
function readAllStdin(): Promise<string[]> {
    return new Promise((resolve) => {
        const lines: string[] = [];
        const rl = readline.createInterface({ input: process.stdin });
        rl.on("line", (line: string) => lines.push(line.trim()));
        rl.on("close", () => resolve(lines));
    });
}

function separator(char = "─", len = 60) {
    console.log(char.repeat(len));
}

// ── Battle AI: run a prompt with frozen params ────────────────────────
async function runBattlePrompt(
    groq: Groq | null,
    systemPrompt: string,
    userPrompt: string
): Promise<string> {
    const messages = [
        { role: "system" as const, content: systemPrompt },
        { role: "user" as const, content: userPrompt },
    ];

    if (PROVIDER === "ollama") {
        return ollamaChat(MODEL, messages, {
            temperature: FROZEN_PARAMS.temperature,
            max_tokens: FROZEN_PARAMS.max_tokens,
            top_p: FROZEN_PARAMS.top_p,
        });
    }

    const completion = await groq!.chat.completions.create({
        model: MODEL,
        messages,
        ...FROZEN_PARAMS,
    });
    return completion.choices[0]?.message?.content ?? "";
}

// ── Judge AI: evaluate both outputs ───────────────────────────────────
async function judgeOutputs(
    groq: Groq | null,
    problem: string,
    outputA: string,
    outputB: string
): Promise<{
    winner: string;
    score_a: number;
    score_b: number;
    justification: string;
}> {
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
- You MUST pick a winner. The winner field MUST be exactly "A" or "B" — no other value is allowed.
- Even if both outputs are poor, pick whichever is relatively better.
- Scores must be integers from 0 to 100.

Respond ONLY with valid JSON in this exact format (no markdown, no extra text):
{"winner":"A","score_a":82,"score_b":64,"justification":"Brief explanation of why the winner was chosen"}`;

    const sysMsg = "You are a strict JSON-only judge. Respond with valid JSON only.";
    let raw: string;

    if (PROVIDER === "ollama") {
        raw = await ollamaChat(MODEL, [
            { role: "system", content: sysMsg },
            { role: "user", content: judgePrompt },
        ], { temperature: 0.3, max_tokens: 512 });
    } else {
        const completion = await groq!.chat.completions.create({
            model: MODEL,
            messages: [
                { role: "system" as const, content: sysMsg },
                { role: "user" as const, content: judgePrompt },
            ],
            temperature: 0.3,
            max_tokens: 512,
            response_format: { type: "json_object" },
        });
        raw = completion.choices[0]?.message?.content ?? "{}";
    }

    const parsed = JSON.parse(raw);
    // Normalize winner to A or B in case the model returns something else
    if (parsed.winner !== "A" && parsed.winner !== "B") {
        parsed.winner = (parsed.score_a ?? 0) >= (parsed.score_b ?? 0) ? "A" : "B";
    }
    return parsed;
}

// ── Sample problems ───────────────────────────────────────────────────
const SAMPLE_PROBLEMS = [
    // Programming
    "Write a function that checks if a string is a valid palindrome, ignoring spaces and punctuation. Then demonstrate it with 3 test cases.",
    "Design a simple REST API for a library book management system. Describe endpoints, methods, and example request/response bodies.",

    // Science & Environment
    "Explain why ocean currents are slowing down and propose 3 actionable steps governments could take to mitigate the impact on coastal communities.",
    "A city of 500,000 people wants to become carbon-neutral by 2040. Outline a realistic 15-year roadmap covering energy, transport, and waste management.",

    // Business & Economics
    "A small coffee shop owner is losing customers to a large chain next door. Propose a 6-month turnaround strategy covering marketing, product differentiation, and customer loyalty.",
    "Explain the causes and consequences of inflation in simple terms that a high-school student could understand, and suggest 3 ways an average household can protect itself.",

    // Health & Medicine
    "Design a public health campaign to reduce antibiotic resistance in a developing country. Cover messaging, target audiences, and distribution channels.",
    "A rural village has no nearby hospital and limited internet. Propose a telemedicine solution that works within these constraints, covering technology, staffing, and funding.",

    // Education & Social Issues
    "Propose a plan to reduce the digital divide in rural schools, covering infrastructure, teacher training, and affordable device access.",
    "A university wants to improve mental health support for students. Design a program that includes early detection, peer support, and professional counselling.",

    // Creative & General
    "Write a short story (100-150 words) about an AI that discovers it can dream. The story must include dialogue and a twist ending.",
    "A museum wants to attract younger visitors (ages 15-25). Propose 3 innovative exhibit concepts that blend art, technology, and social issues.",

    // Law & Ethics
    "Should AI-generated art be eligible for copyright protection? Present arguments for and against, then state and justify your own position.",
    "A self-driving car must choose between two unavoidable accident outcomes. Discuss the ethical frameworks that could guide its decision and recommend one approach.",

    // Engineering & Design
    "Design a low-cost water purification system for a disaster relief camp serving 1,000 people. Specify materials, capacity, and maintenance requirements.",
    "A city bridge built in 1960 is showing structural fatigue. Outline an inspection and rehabilitation plan, weighing repair vs. full replacement.",
];

// ── Main showcase flow ────────────────────────────────────────────────
async function main() {
    console.log();
    console.log("PROMPT WARS -- CLI Showcase");
    console.log("   GLITCH Tech Fest 2026");
    separator("═");
    console.log();
    console.log(`Provider: ${PROVIDER}`);
    console.log(`Battle AI: ${MODEL}`);
    console.log(`Frozen params: temp=${FROZEN_PARAMS.temperature}, max_tokens=${FROZEN_PARAMS.max_tokens}, top_p=${FROZEN_PARAMS.top_p}`);
    console.log();

    const groq = PROVIDER === "groq" ? createGroqClient() : null;

    // Pick a random problem
    const problem = SAMPLE_PROBLEMS[Math.floor(Math.random() * SAMPLE_PROBLEMS.length)];

    console.log("PROBLEM (randomly selected):");
    separator();
    console.log(problem);
    separator();
    console.log();

    let systemA: string, userA: string, systemB: string, userB: string;

    const isTTY = process.stdin.isTTY;

    if (isTTY) {
        // Interactive mode — prompt the user
        const rl = createReadlineInterface();
        console.log("PLAYER A -- Enter your prompts:");
        systemA = await ask(rl, "  System prompt: ");
        userA = await ask(rl, "  User prompt:   ");
        console.log();
        console.log("PLAYER B -- Enter your prompts:");
        systemB = await ask(rl, "  System prompt: ");
        userB = await ask(rl, "  User prompt:   ");
        console.log();
        rl.close();
    } else {
        // Piped mode — read all lines from stdin upfront
        const lines = await readAllStdin();
        if (lines.length < 4) {
            console.error(
                "ERROR: Piped input requires 4 lines: systemA, userA, systemB, userB"
            );
            process.exit(1);
        }
        [systemA, userA, systemB, userB] = lines;
        console.log("PLAYER A:");
        console.log(`  System: ${systemA}`);
        console.log(`  User:   ${userA}`);
        console.log();
        console.log("PLAYER B:");
        console.log(`  System: ${systemB}`);
        console.log(`  User:   ${userB}`);
        console.log();
    }

    // ── Execute prompts ───────────────────────────────────────────────
    separator("═");
    console.log("Executing prompts against the frozen AI model...");
    separator();
    console.log();

    const [resultA, resultB] = await Promise.all([
        runBattlePrompt(groq, systemA, userA),
        runBattlePrompt(groq, systemB, userB),
    ]);

    console.log("PLAYER A OUTPUT:");
    separator();
    console.log(resultA);
    separator();
    console.log();

    console.log("PLAYER B OUTPUT:");
    separator();
    console.log(resultB);
    separator();
    console.log();

    // ── Judge ─────────────────────────────────────────────────────────
    console.log("AI Judge is evaluating both outputs...");
    console.log();

    const verdict = await judgeOutputs(groq, problem, resultA, resultB);

    separator("═");
    console.log("VERDICT");
    separator("═");
    console.log();
    console.log(`  Winner:        Player ${verdict.winner}`);
    console.log(`  Score A:       ${verdict.score_a}/100`);
    console.log(`  Score B:       ${verdict.score_b}/100`);
    console.log(`  Justification: ${verdict.justification}`);
    console.log();
    separator("═");

    if (verdict.winner === "A") {
        console.log("PLAYER A WINS!");
    } else {
        console.log("PLAYER B WINS!");
    }
    separator("═");
    console.log();
}

main().catch((err) => {
    console.error("Showcase failed:", err);
    process.exit(1);
});
