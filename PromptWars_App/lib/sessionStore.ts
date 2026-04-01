// Session store — saves battle data to text files on disk
// Each battle goes into: sessions/<PlayerA>_Vs_<PlayerB>/battle_<timestamp>.txt

import fs from "fs";
import path from "path";

import type { GameSession } from "./gameState";

const SESSIONS_DIR = path.join(process.cwd(), "sessions");

function sanitize(name: string): string {
    return name.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30) || "Unknown";
}

function pad(n: number): string {
    return n.toString().padStart(2, "0");
}

function formatTimestamp(ts: number): string {
    const d = new Date(ts);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
}

function formatDuration(startMs: number, endMs: number): string {
    const diffSec = Math.round((endMs - startMs) / 1000);
    const mins = Math.floor(diffSec / 60);
    const secs = diffSec % 60;
    return `${mins}m ${secs}s`;
}

export function saveSessionToDisk(session: GameSession): string | null {
    try {
        const nameA = sanitize(session.participantA.name || "PlayerA");
        const nameB = sanitize(session.participantB.name || "PlayerB");
        const folderName = `${nameA}_Vs_${nameB}`;
        const folderPath = path.join(SESSIONS_DIR, folderName);

        fs.mkdirSync(folderPath, { recursive: true });

        const timestamp = formatTimestamp(session.createdAt);
        const finishedAt = Date.now();
        const duration = formatDuration(session.createdAt, finishedAt);
        const fileName = `battle_${timestamp}.txt`;
        const filePath = path.join(folderPath, fileName);

        const verdict = session.verdict;
        const winnerName = verdict
            ? verdict.winner === "A"
                ? session.participantA.name
                : verdict.winner === "B"
                    ? session.participantB.name
                    : "No winner"
            : "N/A";

        const lines = [
            `==========================================================`,
            `  PROMPT WARS — BATTLE RECORD`,
            `==========================================================`,
            ``,
            `  Session ID  : ${session.id}`,
            `  Field       : ${session.field}`,
            `  Time Limit  : ${Math.round(session.promptTimeLimitSeconds / 60)} min`,
            `  Date        : ${new Date(session.createdAt).toLocaleString()}`,
            `  Duration    : ${duration}`,
            `  Status      : ${session.status}`,
            ``,
            `----------------------------------------------------------`,
            `  PROBLEM STATEMENT`,
            `----------------------------------------------------------`,
            ``,
            `${session.problem}`,
            ``,
            `==========================================================`,
            `  PARTICIPANT A — ${session.participantA.name || "Unknown"}`,
            `==========================================================`,
            ``,
            `  Connected : ${session.participantA.connected}`,
            `  Submitted : ${session.participantA.submitted}`,
            ``,
            `--- System Prompt ---`,
            `${session.participantA.systemPrompt || "(empty)"}`,
            ``,
            `--- User Prompt ---`,
            `${session.participantA.userPrompt || "(empty)"}`,
            ``,
            `--- AI Output ---`,
            `${session.outputA || "(no output)"}`,
            ``,
            `==========================================================`,
            `  PARTICIPANT B — ${session.participantB.name || "Unknown"}`,
            `==========================================================`,
            ``,
            `  Connected : ${session.participantB.connected}`,
            `  Submitted : ${session.participantB.submitted}`,
            ``,
            `--- System Prompt ---`,
            `${session.participantB.systemPrompt || "(empty)"}`,
            ``,
            `--- User Prompt ---`,
            `${session.participantB.userPrompt || "(empty)"}`,
            ``,
            `--- AI Output ---`,
            `${session.outputB || "(no output)"}`,
            ``,
            `==========================================================`,
            `  VERDICT`,
            `==========================================================`,
            ``,
            verdict
                ? [
                    `  Winner      : Participant ${verdict.winner} (${winnerName})`,
                    verdict.winner === "NONE" ? `  Outcome     : No winner (timer/disqualification)` : null,
                    `  Score A     : ${verdict.score_a} / 100`,
                    `  Score B     : ${verdict.score_b} / 100`,
                    ``,
                    `--- Justification ---`,
                    `${verdict.justification}`,
                ].filter(Boolean).join("\n")
                : `  No verdict recorded.`,
            ``,
            `==========================================================`,
            `  END OF BATTLE RECORD`,
            `==========================================================`,
        ];

        fs.writeFileSync(filePath, lines.join("\n"), "utf-8");
        return filePath;
    } catch (err) {
        console.error("[SessionStore] Failed to save session:", err);
        return null;
    }
}
