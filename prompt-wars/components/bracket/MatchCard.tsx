"use client";

// MatchCard — Single match card in the bracket display

interface MatchCardProps {
    matchNumber: number;
    playerA: string | null;
    playerB: string | null;
    scoreA?: number;
    scoreB?: number;
    winnerId?: string | null;
    status: "pending" | "active" | "completed";
}

export default function MatchCard({
    matchNumber,
    playerA,
    playerB,
    scoreA,
    scoreB,
    winnerId,
    status,
}: MatchCardProps) {
    const statusColor = {
        pending: "border-arena-blue",
        active: "border-arena-amber",
        completed: "border-arena-green",
    }[status];

    return (
        <div className={`border-2 ${statusColor} rounded-lg p-2 min-w-[160px]`}>
            <p className="text-xs text-gray-400">Match #{matchNumber}</p>
            <div className="flex justify-between text-sm mt-1">
                <span>{playerA || "TBD"}</span>
                <span>{scoreA ?? "-"}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span>{playerB || "TBD"}</span>
                <span>{scoreB ?? "-"}</span>
            </div>
        </div>
    );
}
