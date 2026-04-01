"use client";

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

    // Poll session status + send master heartbeat
    const pollStatus = useCallback(async () => {
        try {
            const res = await fetch("/api/status?heartbeat=master");
            if (res.ok) {
                const data = await res.json();
                setSession(data.session);
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

    const status = session?.status ?? "lobby";
    const aConnected = session?.participantA?.connected ?? false;
    const bConnected = session?.participantB?.connected ?? false;
    const aSubmitted = session?.participantA?.submitted ?? false;
    const bSubmitted = session?.participantB?.submitted ?? false;
    const bothConnected = aConnected && bConnected;

    return (
        <main className="min-h-screen px-4 py-8 max-w-5xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-8"
            >
                <button
                    onClick={() => router.push("/")}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
                <div className="flex items-center gap-3">
                    <Crown className="w-6 h-6 text-pw-yellow" />
                    <h1 className="text-2xl font-bold text-white">Master Control</h1>
                    <span className="badge badge-yellow">Judge</span>
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-2xl p-8 max-w-2xl mx-auto"
                >
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-amber-600/20 flex items-center justify-center mx-auto mb-4 border border-yellow-500/10">
                            <Zap className="w-8 h-8 text-pw-yellow" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Create a New Battle</h2>
                        <p className="text-slate-400 text-sm">
                            Start a session. A problem will be randomly selected, or provide your own.
                        </p>
                    </div>

                    {/* Field selector */}
                    <div className="mb-6">
                        <p className="text-sm text-slate-300 mb-3 font-medium">Select Problem Field</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {FIELD_OPTIONS.map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setSelectedField(f)}
                                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all border ${selectedField === f
                                        ? "bg-pw-purple/20 border-pw-purple text-pw-purple shadow-[0_0_12px_rgba(168,85,247,0.15)]"
                                        : "bg-pw-bg/50 border-pw-border text-slate-400 hover:border-slate-500 hover:text-slate-300"
                                        }`}
                                >
                                    {FIELD_LABELS[f]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom problem toggle */}
                    <div className="mb-6">
                        <label className="flex items-center gap-3 cursor-pointer mb-4">
                            <input
                                type="checkbox"
                                checked={useCustom}
                                onChange={(e) => setUseCustom(e.target.checked)}
                                className="w-4 h-4 rounded bg-pw-bg border-pw-border accent-pw-purple"
                            />
                            <span className="text-sm text-slate-300">Use a custom problem statement</span>
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
                        className="btn-neon btn-yellow w-full flex items-center justify-center gap-2"
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
                            <span className="text-xs text-slate-500 font-mono">
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
                            <span className="badge badge-purple">Problem Statement</span>
                            {session.field && (
                                <span className="badge badge-cyan">
                                    {FIELD_LABELS[session.field as FieldSelection] ?? session.field}
                                </span>
                            )}
                        </div>
                        <p className="text-slate-200 leading-relaxed">{session.problem}</p>
                    </motion.div>

                    {/* Participants panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        <ParticipantCard
                            label="Participant A"
                            accent="cyan"
                            connected={aConnected}
                            submitted={aSubmitted}
                            name={session.participantA?.name}
                            output={session.outputA}
                            showOutput={status === "complete"}
                        />
                        <ParticipantCard
                            label="Participant B"
                            accent="magenta"
                            connected={bConnected}
                            submitted={bSubmitted}
                            name={session.participantB?.name}
                            output={session.outputB}
                            showOutput={status === "complete"}
                        />
                    </motion.div>

                    {/* Action buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card rounded-xl p-6"
                    >
                        {status === "lobby" && (
                            <div className="text-center">
                                <Users className="w-10 h-10 text-pw-purple mx-auto mb-3 opacity-60" />
                                <p className="text-slate-400 mb-4 text-sm">
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
                                    <p className="text-xs text-slate-600 mt-3">
                                        Both participants must connect before starting.
                                    </p>
                                )}
                            </div>
                        )}

                        {status === "prompting" && (
                            <div className="text-center">
                                <Clock className="w-10 h-10 text-pw-yellow mx-auto mb-3 animate-glow-pulse" />
                                <p className="text-slate-300 mb-2 font-medium">
                                    Battle in progress — Participants are writing prompts
                                </p>
                                <p className="text-slate-500 text-sm mb-4">
                                    A: {aSubmitted ? "Submitted ✓" : "Writing..."} &nbsp;|&nbsp; B:{" "}
                                    {bSubmitted ? "Submitted ✓" : "Writing..."}
                                </p>
                                <p className="text-xs text-slate-600 mt-1">
                                    Judging will begin automatically once both prompts are submitted.
                                </p>
                            </div>
                        )}

                        {(status === "executing" || status === "judging") && (
                            <div className="text-center py-6">
                                <div className="spinner mx-auto mb-4" />
                                <p className="text-slate-300 font-medium">
                                    {status === "executing"
                                        ? "Executing prompts against the AI model..."
                                        : "AI Judge is evaluating both outputs..."}
                                </p>
                                <p className="text-xs text-slate-500 mt-2">
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
                                className="btn-neon btn-purple flex items-center gap-2 mx-auto"
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
        lobby: { label: "Lobby", cls: "badge-yellow" },
        prompting: { label: "Prompting", cls: "badge-cyan" },
        executing: { label: "Executing", cls: "badge-purple" },
        judging: { label: "Judging", cls: "badge-purple" },
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
}: {
    label: string;
    accent: "cyan" | "magenta";
    connected: boolean;
    submitted: boolean;
    name?: string;
    output?: string;
    showOutput: boolean;
}) {
    const badgeCls = accent === "cyan" ? "badge-cyan" : "badge-magenta";
    const dotCls = connected
        ? "status-dot status-dot-connected"
        : "status-dot status-dot-offline";

    return (
        <div className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <span className={`badge ${badgeCls}`}>{label}</span>
                    {name && <span className="text-sm text-slate-400">{name}</span>}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
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
                    <span className="text-slate-500">Waiting for prompt...</span>
                ) : (
                    <span className="text-slate-600">Not connected</span>
                )}
            </div>

            {showOutput && output && (
                <div className="mt-4">
                    <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">
                        AI Output
                    </p>
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

    return (
        <div className="text-center">
            <Trophy className="w-12 h-12 text-pw-yellow mx-auto mb-4" />
            <h3 className="text-3xl font-black mb-1">
                <span
                    className={
                        isA ? "text-pw-cyan text-glow-cyan" : "text-pw-magenta text-glow-magenta"
                    }
                >
                    Participant {verdict.winner} Wins!
                </span>
            </h3>

            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto my-6">
                <div>
                    <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Participant A</p>
                    <p className="text-3xl font-bold text-pw-cyan">{verdict.score_a}</p>
                    <div className="score-bar mt-2">
                        <div
                            className="score-bar-fill bg-gradient-to-r from-cyan-500 to-blue-500"
                            style={{ width: `${verdict.score_a}%` }}
                        />
                    </div>
                </div>
                <div>
                    <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Participant B</p>
                    <p className="text-3xl font-bold text-pw-magenta">{verdict.score_b}</p>
                    <div className="score-bar mt-2">
                        <div
                            className="score-bar-fill bg-gradient-to-r from-pink-500 to-purple-500"
                            style={{ width: `${verdict.score_b}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="glass-card rounded-xl p-4 max-w-lg mx-auto">
                <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Judge&apos;s Reasoning</p>
                <p className="text-slate-300 text-sm leading-relaxed">{verdict.justification}</p>
            </div>
        </div>
    );
}
