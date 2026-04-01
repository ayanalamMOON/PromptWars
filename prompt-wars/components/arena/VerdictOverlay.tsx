"use client";

// VerdictOverlay — Post-match result reveal animation
// Displayed on verdict:announce event — shows winner, scores, and justification

interface VerdictData {
    winner: "A" | "B";
    scoreA: number;
    scoreB: number;
    justification: string;
}

export default function VerdictOverlay({
    verdict,
    playerA,
    playerB,
}: {
    verdict: VerdictData;
    playerA: string;
    playerB: string;
}) {
    // TODO: Animate with Framer Motion
    // TODO: Display winner name, scores side-by-side, justification text
    const winnerName = verdict.winner === "A" ? playerA : playerB;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-lg text-center">
                <h2 className="text-3xl font-bold text-arena-green">Winner</h2>
                <p className="text-2xl font-bold mt-2">{winnerName}</p>
                <div className="flex justify-center gap-8 mt-4">
                    <div>
                        <p className="text-sm text-gray-500">{playerA}</p>
                        <p className="text-xl font-bold">{verdict.scoreA}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">{playerB}</p>
                        <p className="text-xl font-bold">{verdict.scoreB}</p>
                    </div>
                </div>
                <p className="mt-4 text-sm text-gray-600">{verdict.justification}</p>
            </div>
        </div>
    );
}
