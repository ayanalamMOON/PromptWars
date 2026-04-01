"use client";

import PromptTimer from "@/components/PromptTimer";
import type { GameSession } from "@/lib/gameState";
import type { FieldSelection } from "@/lib/problems";
import { FIELD_LABELS } from "@/lib/problems";
import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    Crown,
    Loader2,
    Play,
    RefreshCw,
    RotateCcw,
    Trophy,
    Users,
    XCircle,
    Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type Status = GameSession["status"];

const FIELD_OPTIONS: FieldSelection[] = [
    "mix",
    "business",
    "computer_science",
    "biotechnology",
    "law",
    "pharma",
];

export default function MasterPage() {
    const router = useRouter();
    const [session, setSession] = useState<GameSession | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [customProblem, setCustomProblem] = useState("");
    const [useCustom, setUseCustom] = useState(false);
    const [selectedField, setSelectedField] = useState<FieldSelection>("mix");
    const [timerMinutes, setTimerMinutes] = useState(10);

    // Poll session status + send master heartbeat
    const pollStatus = useCallback(async () => {
        try {
            const res = await fetch("/api/status?heartbeat=master");
            if (res.ok) {
                const data = await res.json();
                setSession(data.session);
                if (data.session?.promptTimeLimitSeconds) {
                    setTimerMinutes(Math.max(1, Math.round(data.session.promptTimeLimitSeconds / 60)));
                }
            }
        } catch {
            // ignore poll errors
        }
    }, []);

    useEffect(() => {
        pollStatus();
        const interval = setInterval(pollStatus, 1500);
        return () => clearInterval(interval);
    }, [pollStatus]);

    async function createSession() {
        setLoading(true);
        setError(null);
        try {
            const body: Record<string, string> = { field: selectedField };
            body.promptTimeLimitSeconds = String(timerMinutes * 60);
            if (useCustom && customProblem.trim()) {
                body.problem = customProblem.trim();
            }
            const res = await fetch("/api/session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to create session");
            setSession(data.session);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }

    async function startPrompting() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/session", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "prompting" }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed");
            setSession(data.session);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }

    async function resetGame() {
        setLoading(true);
        try {
            await fetch("/api/session", { method: "DELETE" });
            setSession(null);
            setError(null);
        } finally {
            setLoading(false);
        }
    }

    async function updateTimer(nextMinutes: number) {
        setTimerMinutes(nextMinutes);

        if (!session || session.status !== "lobby") {
            return;
        }

        try {
            const res = await fetch("/api/session", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ promptTimeLimitSeconds: nextMinutes * 60 }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update timer");
            setSession(data.session);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Failed to update timer");
        }
    }

    const status = session?.status ?? "lobby";
    const aConnected = session?.participantA?.connected ?? false;
    const bConnected = session?.participantB?.connected ?? false;
    const aSubmitted = session?.participantA?.submitted ?? false;
    const bSubmitted = session?.participantB?.submitted ?? false;
    const bothConnected = aConnected && bConnected;
    const generationModel = session?.generationModel;
    const judgeModel = session?.judgeModel;

    return (
        <main className="min-h-screen px-4 py-8 max-w-5xl mx-auto relative z-[1]">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-between mb-8"
            >
                <button
                    onClick={() => router.push("/")}
                    className="flex items-center gap-2 text-neutral-500 hover:text-neutral-300 transition-colors text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
                <div className="flex items-center gap-3">
                    <Crown className="w-6 h-6 text-pw-red" />
                    <h1 className="text-2xl font-bold text-pw-gold">Master Control</h1>
                    <span className="badge badge-red">Judge</span>
                </div>
                <div className="w-20" />
            </motion.div>

            {/* Error banner */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3"
                    >
                        <XCircle className="w-5 h-5 shrink-0" />
                        {error}
                        <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-300">
                            &times;
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* No session — create one */}
            {!session && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="glass-card shimmer-border rounded-2xl p-8 max-w-2xl mx-auto"
                >
                    <div className="text-center mb-8">
                        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-700/20 flex items-center justify-center mx-auto mb-4 border border-red-500/10">
                            <Zap className="w-8 h-8 text-pw-red" />
                            <div className="pulse-ring rounded-2xl text-pw-red" />
                        </div>
                        <h2 className="text-xl font-bold text-pw-gold mb-2">Create a New Battle</h2>
                        <p className="text-pw-muted text-sm">
                            Start a session. A problem will be randomly selected, or provide your own.
                        </p>
                    </div>

                    {/* Field selector */}
                    <div className="mb-6">
                        <p className="text-sm text-neutral-300 mb-3 font-medium">Select Problem Field</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {FIELD_OPTIONS.map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setSelectedField(f)}
                                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 border ${selectedField === f
                                        ? "bg-pw-red/15 border-pw-red text-pw-red shadow-[0_0_12px_rgba(239,68,68,0.15)]"
                                        : "bg-pw-gold/5 border-pw-gold/10 text-neutral-400 hover:border-pw-gold/30 hover:text-pw-gold hover:bg-pw-gold/10"
                                        }`}
                                >
                                    {FIELD_LABELS[f]}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm text-neutral-300 mb-2 font-medium">
                            Prompt Timer
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="range"
                                min={1}
                                max={10}
                                step={1}
                                value={timerMinutes}
                                onChange={(e) => updateTimer(Number(e.target.value))}
                                className="w-full accent-red-500"
                            />
                            <div className="min-w-[88px] rounded-lg border border-pw-red/20 bg-pw-red/5 px-3 py-2 text-sm font-semibold text-pw-gold text-center">
                                {timerMinutes} min
                            </div>
                        </div>
                        <p className="text-xs text-neutral-500 mt-2">
                            Mandatory battle timer. If one participant misses the deadline, the other qualifies automatically.
                        </p>
                    </div>

                    {/* Custom problem toggle */}
                    <div className="mb-6">
                        <label className="flex items-center gap-3 cursor-pointer mb-4">
                            <input
                                type="checkbox"
                                checked={useCustom}
                                onChange={(e) => setUseCustom(e.target.checked)}
                                className="w-4 h-4 rounded bg-pw-bg border-pw-border accent-pw-red"
                            />
                            <span className="text-sm text-neutral-300">Use a custom problem statement</span>
                        </label>
                        {useCustom && (
                            <textarea
                                value={customProblem}
                                onChange={(e) => setCustomProblem(e.target.value)}
                                placeholder="Enter your custom problem statement here..."
                                rows={4}
                                className="input-dark"
                            />
                        )}
                    </div>

                    <button
                        onClick={createSession}
                        disabled={loading}
                        className="btn-neon btn-red w-full flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                        Create Battle Session
                    </button>
                </motion.div>
            )}

            {/* Active session */}
            {session && (
                <div className="space-y-6">
                    {/* Status bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card rounded-xl p-5 flex flex-wrap items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-4">
                            <StatusBadge status={status} />
                            <span className="text-xs text-neutral-500 font-mono">
                                Session: {session.id.slice(0, 8)}…
                            </span>
                        </div>
                        <button
                            onClick={resetGame}
                            className="btn-neon btn-red text-xs px-4 py-2 flex items-center gap-2"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Reset
                        </button>
                    </motion.div>

                    {/* Problem display */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card rounded-xl p-6"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <span className="badge badge-red">Problem Statement</span>
                            {session.field && (
                                <span className="badge badge-green">
                                    {FIELD_LABELS[session.field as FieldSelection] ?? session.field}
                                </span>
                            )}
                        </div>
                        <p className="text-neutral-200 leading-relaxed text-[0.95rem] whitespace-pre-line">{session.problem}</p>
                    </motion.div>

                    {status === "lobby" && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.12 }}
                            className="glass-card rounded-xl p-6"
                        >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
                                <div>
                                    <p className="text-sm font-semibold text-pw-gold">Prompt Timer Settings</p>
                                    <p className="text-xs text-neutral-500">
                                        Adjust before starting the battle. Maximum allowed: 10 minutes.
                                    </p>
                                </div>
                                <span className="badge badge-red">{timerMinutes} min</span>
                            </div>

                            <input
                                type="range"
                                min={1}
                                max={10}
                                step={1}
                                value={timerMinutes}
                                onChange={(e) => updateTimer(Number(e.target.value))}
                                className="w-full accent-red-500"
                            />
                        </motion.div>
                    )}

                    {status === "prompting" && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                        >
                            <PromptTimer
                                deadlineAt={session.promptDeadlineAt}
                                durationSeconds={session.promptTimeLimitSeconds}
                                title="Live Battle Timer"
                                subtitle="If a participant does not submit before the timer expires, they are disqualified automatically."
                            />
                        </motion.div>
                    )}

                    {/* Participants panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        <ParticipantCard
                            label="Participant A"
                            accent="green"
                            connected={aConnected}
                            submitted={aSubmitted}
                            name={session.participantA?.name}
                            output={session.outputA}
                            showOutput={status === "complete"}
                            generationModel={generationModel}
                            judgeModel={judgeModel}
                        />
                        <ParticipantCard
                            label="Participant B"
                            accent="gold"
                            connected={bConnected}
                            submitted={bSubmitted}
                            name={session.participantB?.name}
                            output={session.outputB}
                            showOutput={status === "complete"}
                            generationModel={generationModel}
                            judgeModel={judgeModel}
                        />
                    </motion.div>

                    {/* Action area */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card rounded-xl p-6"
                    >
                        {status === "lobby" && (
                            <div className="text-center">
                                <Users className="w-10 h-10 text-pw-muted mx-auto mb-3 opacity-60" />
                                <p className="text-neutral-400 mb-4 text-sm">
                                    Waiting for both participants to connect...
                                </p>
                                <button
                                    onClick={startPrompting}
                                    disabled={!bothConnected || loading}
                                    className={`btn-neon btn-green flex items-center justify-center gap-2 mx-auto ${!bothConnected ? "opacity-40 cursor-not-allowed" : ""
                                        }`}
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Play className="w-5 h-5" />
                                    )}
                                    Start Battle
                                </button>
                                {!bothConnected && (
                                    <p className="text-xs text-neutral-600 mt-3">
                                        Both participants must connect before starting.
                                    </p>
                                )}
                            </div>
                        )}

                        {status === "prompting" && (
                            <div className="text-center">
                                <Clock className="w-10 h-10 text-pw-red mx-auto mb-3 animate-glow-pulse" />
                                <p className="text-neutral-300 mb-2 font-medium">
                                    Battle in progress — Participants are writing prompts
                                </p>
                                <p className="text-neutral-500 text-sm mb-4">
                                    A: {aSubmitted ? "Submitted ✓" : "Writing..."} &nbsp;|&nbsp; B:{" "}
                                    {bSubmitted ? "Submitted ✓" : "Writing..."}
                                </p>
                                <p className="text-xs text-neutral-600 mt-1">
                                    Judging will begin automatically once both prompts are submitted.
                                </p>
                            </div>
                        )}

                        {(status === "executing" || status === "judging") && (
                            <div className="text-center py-6">
                                <div className="spinner mx-auto mb-4" />
                                <p className="text-neutral-300 font-medium">
                                    {status === "executing"
                                        ? "Executing prompts against the AI model..."
                                        : "AI Judge is evaluating both outputs..."}
                                </p>
                                <p className="text-xs text-neutral-500 mt-2">
                                    This may take a moment depending on model speed.
                                </p>
                            </div>
                        )}

                        {status === "complete" && session.verdict && (
                            <VerdictDisplay verdict={session.verdict} />
                        )}
                    </motion.div>

                    {/* New round */}
                    {status === "complete" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-center"
                        >
                            <button
                                onClick={resetGame}
                                className="btn-neon btn-red flex items-center gap-2 mx-auto"
                            >
                                <RefreshCw className="w-4 h-4" />
                                New Round
                            </button>
                        </motion.div>
                    )}
                </div>
            )}
        </main>
    );
}

/* ── Sub-components ─────────────────────────────────────────────────── */

function StatusBadge({ status }: { status: Status }) {
    const map: Record<Status, { label: string; cls: string }> = {
        lobby: { label: "Lobby", cls: "badge-red" },
        prompting: { label: "Prompting", cls: "badge-green" },
        executing: { label: "Executing", cls: "badge-red" },
        judging: { label: "Judging", cls: "badge-red" },
        complete: { label: "Complete", cls: "badge-green" },
    };
    const { label, cls } = map[status] ?? map.lobby;
    return <span className={`badge ${cls}`}>{label}</span>;
}

function ParticipantCard({
    label,
    accent,
    connected,
    submitted,
    name,
    output,
    showOutput,
    generationModel,
    judgeModel,
}: {
    label: string;
    accent: "green" | "gold";
    connected: boolean;
    submitted: boolean;
    name?: string;
    output?: string;
    showOutput: boolean;
    generationModel?: string;
    judgeModel?: string;
}) {
    const badgeCls = accent === "green" ? "badge-green" : "badge-gold";
    const dotCls = connected
        ? "status-dot status-dot-connected"
        : "status-dot status-dot-offline";

    return (
        <div className="glass-card rounded-xl p-5 transition-all duration-300 hover:border-pw-gold/15">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <span className={`badge ${badgeCls}`}>{label}</span>
                    {name && <span className="text-sm text-neutral-400">{name}</span>}
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span className={dotCls} />
                    {connected ? "Connected" : "Offline"}
                </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
                {submitted ? (
                    <span className="flex items-center gap-1.5 text-pw-green">
                        <CheckCircle2 className="w-4 h-4" />
                        Prompt submitted
                    </span>
                ) : connected ? (
                    <span className="text-neutral-500">Waiting for prompt...</span>
                ) : (
                    <span className="text-neutral-600">Not connected</span>
                )}
            </div>

            {submitted && (generationModel || judgeModel) && (
                <div className="mt-3 rounded-lg border border-pw-gold/10 bg-pw-gold/5 px-3 py-2 text-xs space-y-1">
                    {generationModel && (
                        <p className="text-neutral-400">
                            Generation model: <span className="text-neutral-200 font-mono">{generationModel}</span>
                        </p>
                    )}
                    {judgeModel && (
                        <p className="text-neutral-400">
                            Judge model: <span className="text-neutral-200 font-mono">{judgeModel}</span>
                        </p>
                    )}
                </div>
            )}

            {showOutput && output && (
                <div className="mt-4">
                    <p className="output-section-label">AI Output</p>
                    <div className="output-box">{output}</div>
                </div>
            )}
        </div>
    );
}

function VerdictDisplay({
    verdict,
}: {
    verdict: NonNullable<GameSession["verdict"]>;
}) {
    const isA = verdict.winner === "A";
    const hasNoWinner = verdict.winner === "NONE";

    return (
        <div className="text-center">
            <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
                <Trophy className="w-14 h-14 text-pw-red mx-auto mb-4 drop-shadow-[0_0_12px_rgba(239,68,68,0.3)]" />
            </motion.div>
            <h3 className="verdict-winner mb-1">
                {hasNoWinner ? (
                    <span className="text-red-400 text-glow-red">No Winner — Timer Expired</span>
                ) : (
                    <span className={isA ? "text-pw-green text-glow-green" : "text-pw-gold text-glow-gold"}>
                        Participant {verdict.winner} Wins!
                    </span>
                )}
            </h3>

            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto my-6">
                <div>
                    <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wider">Participant A</p>
                    <p className="text-3xl font-bold text-pw-green">{verdict.score_a}</p>
                    <div className="score-bar mt-2">
                        <div
                            className="score-bar-fill bg-gradient-to-r from-green-500 to-emerald-400"
                            style={{ width: `${verdict.score_a}%` }}
                        />
                    </div>
                </div>
                <div>
                    <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wider">Participant B</p>
                    <p className="text-3xl font-bold text-pw-gold">{verdict.score_b}</p>
                    <div className="score-bar mt-2">
                        <div
                            className="score-bar-fill bg-gradient-to-r from-amber-500 to-yellow-300"
                            style={{ width: `${verdict.score_b}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="verdict-justification max-w-lg mx-auto">
                <p className="text-xs text-neutral-500 mb-2 uppercase tracking-wider">Judge&apos;s Reasoning</p>
                <p className="text-neutral-300 text-sm leading-relaxed">{verdict.justification}</p>
            </div>
        </div>
    );
}
