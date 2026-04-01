"use client";

import { useEffect, useState } from "react";

// useMatchState — Zustand-compatible match state hook
// Tracks match phase, problem, submissions, outputs, verdict

interface MatchState {
    phase: "waiting" | "reveal" | "engineering" | "execution" | "verdict";
    problem: string | null;
    constraints: string[];
    poisonPill: string | null;
    outputA: string;
    outputB: string;
    verdict: {
        winner: "A" | "B";
        scoreA: number;
        scoreB: number;
        justification: string;
    } | null;
}

export function useMatchState(socket: any) {
    const [state, setState] = useState<MatchState>({
        phase: "waiting",
        problem: null,
        constraints: [],
        poisonPill: null,
        outputA: "",
        outputB: "",
        verdict: null,
    });

    useEffect(() => {
        if (!socket) return;

        socket.on("problem:reveal", (data: { statement: string; constraints: string[] }) => {
            setState((prev) => ({
                ...prev,
                phase: "engineering",
                problem: data.statement,
                constraints: data.constraints || [],
            }));
        });

        socket.on("poison:inject", (data: { constraint: string }) => {
            setState((prev) => ({ ...prev, poisonPill: data.constraint }));
        });

        socket.on("execution:start", () => {
            setState((prev) => ({ ...prev, phase: "execution" }));
        });

        socket.on("output:stream", (data: { player: "A" | "B"; token: string }) => {
            setState((prev) => ({
                ...prev,
                [data.player === "A" ? "outputA" : "outputB"]:
                    prev[data.player === "A" ? "outputA" : "outputB"] + data.token,
            }));
        });

        socket.on("verdict:announce", (data: { winner: "A" | "B"; scoreA: number; scoreB: number; justification: string }) => {
            setState((prev) => ({
                ...prev,
                phase: "verdict",
                verdict: data,
            }));
        });

        return () => {
            socket.off("problem:reveal");
            socket.off("poison:inject");
            socket.off("execution:start");
            socket.off("output:stream");
            socket.off("verdict:announce");
        };
    }, [socket]);

    return state;
}
