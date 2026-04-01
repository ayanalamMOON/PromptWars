// In-memory game state for the showcase app
// This runs on the server side only — state is shared across all API routes

import type { FieldSelection } from "@/lib/problems";

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
    status: "lobby" | "prompting" | "executing" | "judging" | "complete";
    participantA: ParticipantState;
    participantB: ParticipantState;
    outputA: string;
    outputB: string;
    verdict: {
        winner: "A" | "B";
        score_a: number;
        score_b: number;
        justification: string;
    } | null;
    createdAt: number;
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

// Singleton session — only one game at a time for showcase
let session: GameSession | null = null;

// Master connection tracking (heartbeat-based)
let masterLastSeen: number = 0;
const MASTER_TIMEOUT_MS = 8000; // consider disconnected after 8s without heartbeat

export function pingMaster(): void {
    masterLastSeen = Date.now();
}

export function isMasterConnected(): boolean {
    return Date.now() - masterLastSeen < MASTER_TIMEOUT_MS;
}

export function getSession(): GameSession | null {
    return session;
}

export function createSession(problem: string, field: FieldSelection = "mix"): GameSession {
    session = {
        id: crypto.randomUUID(),
        problem,
        field,
        status: "lobby",
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

export function updateSession(updates: Partial<GameSession>): GameSession | null {
    if (!session) return null;
    Object.assign(session, updates);
    return session;
}
