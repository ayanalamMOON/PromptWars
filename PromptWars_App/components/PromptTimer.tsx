"use client";

import { Clock3 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function formatRemaining(msRemaining: number): string {
    const totalSeconds = Math.max(0, Math.ceil(msRemaining / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export default function PromptTimer({
    deadlineAt,
    durationSeconds,
    title = "Prompt Timer",
    subtitle,
}: {
    deadlineAt: number | null;
    durationSeconds: number;
    title?: string;
    subtitle?: string;
}) {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        if (!deadlineAt) return;
        const interval = setInterval(() => setNow(Date.now()), 250);
        return () => clearInterval(interval);
    }, [deadlineAt]);

    const remainingMs = deadlineAt ? Math.max(0, deadlineAt - now) : durationSeconds * 1000;
    const progressPercent = useMemo(() => {
        if (!durationSeconds) return 0;
        return Math.max(0, Math.min(100, (remainingMs / (durationSeconds * 1000)) * 100));
    }, [durationSeconds, remainingMs]);

    const isExpired = deadlineAt ? remainingMs <= 0 : false;

    return (
        <div className="glass-card rounded-xl p-5 border border-pw-red/20">
            <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-neutral-500 mb-1">{title}</p>
                    <p className="text-sm text-neutral-300">
                        {subtitle ?? "Both participants must submit before time runs out."}
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <Clock3 className={`w-5 h-5 ${isExpired ? "text-red-400" : "text-pw-red"}`} />
                    <span className={`font-mono text-2xl font-bold ${isExpired ? "text-red-400" : "text-pw-gold"}`}>
                        {formatRemaining(remainingMs)}
                    </span>
                </div>
            </div>

            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                    className={`h-full transition-all duration-300 ${isExpired
                        ? "bg-gradient-to-r from-red-600 to-red-400"
                        : "bg-gradient-to-r from-pw-red via-orange-400 to-pw-gold"
                        }`}
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            <div className="mt-2 flex items-center justify-between text-xs text-neutral-500">
                <span>Time limit: {Math.round(durationSeconds / 60)} min</span>
                <span>{isExpired ? "Submission window closed" : "Live countdown"}</span>
            </div>
        </div>
    );
}
