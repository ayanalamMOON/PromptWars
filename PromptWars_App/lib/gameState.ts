// In-memory game state for PromptWars App
// This runs on the server side only — state is shared across all API routes

import type { FieldSelection } from "@/lib/problems";

export const DEFAULT_PROMPT_TIME_LIMIT_SECONDS = 10 * 60;
export const MAX_PROMPT_TIME_LIMIT_SECONDS = 10 * 60;
export const MIN_PROMPT_TIME_LIMIT_SECONDS = 60;

export type Winner = "A" | "B" | "NONE";

export interface GameVerdict {
    winner: Winner;
    score_a: number;
    score_b: number;
    justification: string;
}

export interface ParticipantState {
    connected: boolean;
    name: string;
    systemPrompt: string;
    userPrompt: string;
    submitted: boolean;
}

export interface GameSession {
    id: string;
    problem: string;
    field: FieldSelection;
    generationModel?: string;
    judgeModel?: string;
    status: "lobby" | "prompting" | "executing" | "judging" | "complete";
    promptTimeLimitSeconds: number;
    promptStartedAt: number | null;
    promptDeadlineAt: number | null;
    participantA: ParticipantState;
    participantB: ParticipantState;
    outputA: string;
    outputB: string;
    verdict: GameVerdict | null;
    createdAt: number;
}

export function normalizePromptTimeLimitSeconds(value: unknown): number {
    const parsed = typeof value === "number"
        ? value
        : typeof value === "string"
            ? Number(value)
            : NaN;

    if (!Number.isFinite(parsed)) {
        return DEFAULT_PROMPT_TIME_LIMIT_SECONDS;
    }

    const rounded = Math.round(parsed);
    return Math.max(
        MIN_PROMPT_TIME_LIMIT_SECONDS,
        Math.min(MAX_PROMPT_TIME_LIMIT_SECONDS, rounded)
    );
}

function createEmptyParticipant(): ParticipantState {
    return {
        connected: false,
        name: "",
        systemPrompt: "",
        userPrompt: "",
        submitted: false,
    };
}

// Singleton session — only one game at a time
let session: GameSession | null = null;

// Master connection tracking (heartbeat-based)
let masterLastSeen: number = 0;
const MASTER_TIMEOUT_MS = 8000;

export function pingMaster(): void {
    masterLastSeen = Date.now();
}

export function isMasterConnected(): boolean {
    return Date.now() - masterLastSeen < MASTER_TIMEOUT_MS;
}

export function getSession(): GameSession | null {
    return session;
}

export function createSession(
    problem: string,
    field: FieldSelection = "mix",
    promptTimeLimitSeconds: number = DEFAULT_PROMPT_TIME_LIMIT_SECONDS
): GameSession {
    const normalizedPromptTimeLimitSeconds = normalizePromptTimeLimitSeconds(promptTimeLimitSeconds);

    session = {
        id: crypto.randomUUID(),
        problem,
        field,
        status: "lobby",
        promptTimeLimitSeconds: normalizedPromptTimeLimitSeconds,
        promptStartedAt: null,
        promptDeadlineAt: null,
        participantA: createEmptyParticipant(),
        participantB: createEmptyParticipant(),
        outputA: "",
        outputB: "",
        verdict: null,
        createdAt: Date.now(),
    };
    return session;
}

export function resetSession(): void {
    session = null;
    masterLastSeen = 0;
}

export function beginPromptingPhase(): GameSession | null {
    if (!session) return null;

    const now = Date.now();
    session.status = "prompting";
    session.promptStartedAt = now;
    session.promptDeadlineAt = now + session.promptTimeLimitSeconds * 1000;
    return session;
}

function buildPromptTimeoutVerdict(currentSession: GameSession): GameVerdict {
    const aSubmitted = currentSession.participantA.submitted;
    const bSubmitted = currentSession.participantB.submitted;

    if (aSubmitted && !bSubmitted) {
        return {
            winner: "A",
            score_a: 100,
            score_b: 0,
            justification:
                "Participant B was disqualified for failing to submit before the timer expired. Participant A qualifies automatically.",
        };
    }

    if (bSubmitted && !aSubmitted) {
        return {
            winner: "B",
            score_a: 0,
            score_b: 100,
            justification:
                "Participant A was disqualified for failing to submit before the timer expired. Participant B qualifies automatically.",
        };
    }

    return {
        winner: "NONE",
        score_a: 0,
        score_b: 0,
        justification:
            "The timer expired before either participant submitted a prompt. Both participants were disqualified.",
    };
}

export function enforcePromptDeadline(): GameSession | null {
    if (!session || session.status !== "prompting" || !session.promptDeadlineAt) {
        return session;
    }

    if (Date.now() < session.promptDeadlineAt) {
        return session;
    }

    session.status = "complete";
    session.verdict = buildPromptTimeoutVerdict(session);
    return session;
}

export function updateSession(updates: Partial<GameSession>): GameSession | null {
    if (!session) return null;
    Object.assign(session, updates);
    if (typeof updates.promptTimeLimitSeconds !== "undefined") {
        session.promptTimeLimitSeconds = normalizePromptTimeLimitSeconds(updates.promptTimeLimitSeconds);
    }
    return session;
}
