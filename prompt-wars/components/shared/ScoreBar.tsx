"use client";

// ScoreBar — Visual score comparison bar

export default function ScoreBar({
    scoreA,
    scoreB,
}: {
    scoreA: number;
    scoreB: number;
}) {
    const total = scoreA + scoreB || 1;
    const widthA = (scoreA / total) * 100;

    return (
        <div className="flex h-4 rounded overflow-hidden">
            <div
                className="bg-arena-blue transition-all"
                style={{ width: `${widthA}%` }}
            />
            <div className="bg-arena-red flex-1" />
        </div>
    );
}
