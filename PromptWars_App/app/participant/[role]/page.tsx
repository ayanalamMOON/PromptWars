"use client";

import ParticipantSecurityGuard from "@/components/ParticipantSecurityGuard";
import PromptTimer from "@/components/PromptTimer";
import type { GameSession } from "@/lib/gameState";
import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    Loader2,
    Send,
    Shield,
    Swords,
    Trophy,
    Wifi,
    WifiOff,
    Zap,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ParticipantPage() {
    const router = useRouter();
    const params = useParams();
    const role = (params.role as string)?.toUpperCase() === "B" ? "B" : "A";

    const [session, setSession] = useState<GameSession | null>(null);
    const [connected, setConnected] = useState(false);
    const [systemPrompt, setSystemPrompt] = useState("");
    const [userPrompt, setUserPrompt] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [participantName, setParticipantName] = useState("");
    const [nameSet, setNameSet] = useState(false);

    const isA = role === "A";
    const Icon = isA ? Swords : Shield;
    const badgeCls = isA ? "badge-green" : "badge-gold";
    const btnCls = isA ? "btn-green" : "btn-gold";
    const textColor = isA ? "text-pw-green" : "text-pw-gold";
    const glowCls = isA ? "text-glow-green" : "text-glow-gold";

    // Poll session status
    const pollStatus = useCallback(async () => {
        try {
            const res = await fetch("/api/status");
            if (res.ok) {
                const data = await res.json();
                setSession(data.session);
                if (data.session) {
                    const participant = role === "A" ? data.session.participantA : data.session.participantB;
                    if (participant?.submitted) {
                        setSubmitted(true);
                    }
                }
            }
        } catch {
            // ignore
        }
    }, [role]);

    useEffect(() => {
        pollStatus();
        const interval = setInterval(pollStatus, 1500);
        return () => clearInterval(interval);
    }, [pollStatus]);

    // Connect / join session
    async function joinSession() {
        if (!participantName.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/session", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    join: role,
                    name: participantName.trim(),
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to join");
            setSession(data.session);
            setConnected(true);
            setNameSet(true);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }

    // Submit prompts
    async function submitPrompts() {
        if (!systemPrompt.trim() || !userPrompt.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    role,
                    systemPrompt: systemPrompt.trim(),
                    userPrompt: userPrompt.trim(),
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to submit");
            setSession(data.session);
            setSubmitted(true);
            if (data.disqualified) {
                setError(`You have been disqualified: ${data.reason}`);
            }
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }

    const status = session?.status ?? null;
    const verdict = session?.verdict;
    const myOutput = role === "A" ? session?.outputA : session?.outputB;
    const generationModel = session?.generationModel;
    const judgeModel = session?.judgeModel;
    const showModelPipeline = submitted || status === "executing" || status === "judging" || status === "complete";

    return (
        <main className="min-h-screen px-4 py-8 max-w-3xl mx-auto relative z-[1]">
            <ParticipantSecurityGuard />

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
                    <Icon className={`w-6 h-6 ${textColor}`} />
                    <h1 className="text-2xl font-bold text-pw-gold">Participant {role}</h1>
                    <span className={`badge ${badgeCls}`}>{isA ? "Challenger" : "Defender"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                    {connected ? (
                        <>
                            <Wifi className="w-4 h-4 text-pw-green" />
                            <span className="text-pw-green">Connected</span>
                        </>
                    ) : (
                        <>
                            <WifiOff className="w-4 h-4" />
                            <span>Disconnected</span>
                        </>
                    )}
                </div>
            </motion.div>

            {/* Error banner */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {session && connected && showModelPipeline && (generationModel || judgeModel) && (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-xl p-4 mb-6"
                >
                    <p className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Active Model Workflow</p>
                    <div className="space-y-1.5 text-sm">
                        {generationModel && (
                            <p className="text-neutral-300">
                                Output generation model: <span className="font-mono text-pw-gold">{generationModel}</span>
                            </p>
                        )}
                        {judgeModel && (
                            <p className="text-neutral-300">
                                Judging model: <span className="font-mono text-pw-red">{judgeModel}</span>
                            </p>
                        )}
                    </div>
                </motion.div>
            )}

            {/* No session exists yet */}
            {!session && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-2xl p-8 text-center"
                >
                    <Clock className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-pw-gold mb-2">Waiting for Master</h2>
                    <p className="text-neutral-400 text-sm">
                        The Master has not created a session yet. Please wait...
                    </p>
                    <div className="spinner mx-auto mt-6" />
                </motion.div>
            )}

            {/* Session exists but not connected — join form */}
            {session && !connected && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card shimmer-border rounded-2xl p-8 max-w-md mx-auto"
                >
                    <div className="text-center mb-6">
                        <div
                            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${isA
                                ? "from-green-500/20 to-emerald-600/20"
                                : "from-amber-400/20 to-yellow-600/20"
                                } flex items-center justify-center mx-auto mb-4 border border-pw-gold/10`}
                        >
                            <Icon className={`w-8 h-8 ${textColor}`} />
                        </div>
                        <h2 className="text-xl font-bold text-pw-gold mb-2">Join the Battle</h2>
                        <p className="text-neutral-400 text-sm">
                            A battle session is active. Enter your name to join as Participant {role}.
                        </p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm text-neutral-400 mb-2">Your Name</label>
                        <input
                            type="text"
                            value={participantName}
                            onChange={(e) => setParticipantName(e.target.value)}
                            placeholder="Enter your name..."
                            maxLength={30}
                            className="input-dark"
                            onKeyDown={(e) => e.key === "Enter" && joinSession()}
                        />
                    </div>

                    <button
                        onClick={joinSession}
                        disabled={loading || !participantName.trim()}
                        className={`btn-neon ${btnCls} w-full flex items-center justify-center gap-2 ${!participantName.trim() ? "opacity-40 cursor-not-allowed" : ""
                            }`}
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                        Join Session
                    </button>
                </motion.div>
            )}

            {/* Connected — in lobby, waiting for master to start */}
            {session && connected && status === "lobby" && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-2xl p-8 text-center"
                >
                    <CheckCircle2 className={`w-12 h-12 ${textColor} mx-auto mb-4`} />
                    <h2 className="text-xl font-bold text-pw-gold mb-2">Connected!</h2>
                    <p className="text-neutral-400 text-sm mb-4">
                        Waiting for the Master to start the battle...
                    </p>
                    <div className="spinner mx-auto" />
                </motion.div>
            )}

            {/* Prompting phase */}
            {session && connected && status === "prompting" && !submitted && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <PromptTimer
                        deadlineAt={session.promptDeadlineAt}
                        durationSeconds={session.promptTimeLimitSeconds}
                        title="Submission Timer"
                        subtitle="Submit before the countdown ends or you will be disqualified automatically."
                    />

                    {/* Problem */}
                    <div className="glass-card rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="badge badge-red">Problem Statement</span>
                        </div>
                        <p className="text-neutral-200 leading-relaxed whitespace-pre-line">{session.problem}</p>
                    </div>

                    {/* Prompt inputs */}
                    <div className="glass-card rounded-xl p-6">
                        <h3 className="text-lg font-bold text-pw-gold mb-4">Craft Your Prompts</h3>
                        <p className="text-neutral-400 text-sm mb-6">
                            Write a system prompt and user prompt. The AI will receive both to generate a response.
                        </p>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                    System Prompt
                                </label>
                                <textarea
                                    value={systemPrompt}
                                    onChange={(e) => setSystemPrompt(e.target.value)}
                                    placeholder="You are a helpful assistant that..."
                                    rows={4}
                                    className="input-dark"
                                />
                                <p className="text-xs text-neutral-600 mt-1">
                                    Sets the AI&apos;s behavior and persona.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                    User Prompt
                                </label>
                                <textarea
                                    value={userPrompt}
                                    onChange={(e) => setUserPrompt(e.target.value)}
                                    placeholder="Please solve the following problem..."
                                    rows={4}
                                    className="input-dark"
                                />
                                <p className="text-xs text-neutral-600 mt-1">
                                    The actual instruction/question sent to the AI.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={submitPrompts}
                            disabled={loading || !systemPrompt.trim() || !userPrompt.trim()}
                            className={`btn-neon ${btnCls} w-full flex items-center justify-center gap-2 mt-6 ${!systemPrompt.trim() || !userPrompt.trim()
                                ? "opacity-40 cursor-not-allowed"
                                : ""
                                }`}
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                            Submit Prompts
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Submitted — waiting */}
            {session && connected && status === "prompting" && submitted && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <PromptTimer
                        deadlineAt={session.promptDeadlineAt}
                        durationSeconds={session.promptTimeLimitSeconds}
                        title="Submission Timer"
                        subtitle="Your prompt is locked in. If your opponent misses the deadline, you qualify automatically."
                    />

                    <div className="glass-card rounded-2xl p-8 text-center">
                        <CheckCircle2 className="w-12 h-12 text-pw-green mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-pw-gold mb-2">Prompts Submitted!</h2>
                        <p className="text-neutral-400 text-sm mb-4">
                            Waiting for your opponent to submit and the Master to execute...
                        </p>
                        <div className="spinner mx-auto" />
                    </div>
                </motion.div>
            )}

            {/* Executing / Judging */}
            {session && connected && (status === "executing" || status === "judging") && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-2xl p-8 text-center"
                >
                    <div className="spinner mx-auto mb-4" style={{ width: 40, height: 40, borderWidth: 4 }} />
                    <h2 className="text-xl font-bold text-pw-gold mb-2">
                        {status === "executing" ? "AI is Generating..." : "Judge is Evaluating..."}
                    </h2>
                    <p className="text-neutral-400 text-sm">
                        {status === "executing"
                            ? `Both prompts are being executed with ${generationModel ?? "the configured generation model"}.`
                            : `The AI judge (${judgeModel ?? "the configured judge model"}) is comparing both outputs and scoring them.`}
                    </p>
                </motion.div>
            )}

            {/* Complete — verdict */}
            {session && connected && status === "complete" && verdict && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Winner announcement */}
                    <div className="glass-card rounded-2xl p-8 text-center">
                        <motion.div
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        >
                            <Trophy className="w-14 h-14 text-pw-red mx-auto mb-4 drop-shadow-[0_0_12px_rgba(239,68,68,0.3)]" />
                        </motion.div>
                        {verdict.winner === "NONE" ? (
                            <>
                                <h2 className="text-4xl font-black text-red-400 mb-2">NO WINNER</h2>
                                <p className="text-neutral-500">The timer expired before a valid submission was completed.</p>
                            </>
                        ) : verdict.winner === role ? (
                            <>
                                <h2 className={`text-4xl font-black ${textColor} ${glowCls} mb-2`}>
                                    YOU WIN!
                                </h2>
                                <p className="text-neutral-400">Congratulations, your prompts were superior!</p>
                            </>
                        ) : (
                            <>
                                <h2 className="text-4xl font-black text-neutral-400 mb-2">You Lost</h2>
                                <p className="text-neutral-500">Better luck next round!</p>
                            </>
                        )}
                    </div>

                    {/* Scores */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="glass-card rounded-xl p-5 text-center">
                            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
                                Participant A
                            </p>
                            <p className="text-3xl font-bold text-pw-green">{verdict.score_a}</p>
                            <div className="score-bar mt-3">
                                <div
                                    className="score-bar-fill bg-gradient-to-r from-green-500 to-emerald-400"
                                    style={{ width: `${verdict.score_a}%` }}
                                />
                            </div>
                        </div>
                        <div className="glass-card rounded-xl p-5 text-center">
                            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">
                                Participant B
                            </p>
                            <p className="text-3xl font-bold text-pw-gold">{verdict.score_b}</p>
                            <div className="score-bar mt-3">
                                <div
                                    className="score-bar-fill bg-gradient-to-r from-amber-500 to-yellow-300"
                                    style={{ width: `${verdict.score_b}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Justification */}
                    <div className="glass-card rounded-xl p-6">
                        <p className="text-xs text-neutral-500 uppercase tracking-wider mb-3">
                            Judge&apos;s Reasoning
                        </p>
                        <p className="text-neutral-300 text-sm leading-relaxed">{verdict.justification}</p>
                    </div>

                    {/* Your output */}
                    {myOutput && (
                        <div className="glass-card rounded-xl p-6">
                            <p className="output-section-label">Your AI Output</p>
                            <div className="output-box">{myOutput}</div>
                        </div>
                    )}
                </motion.div>
            )}
        </main>
    );
}
