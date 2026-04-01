"use client";

// ProblemDisplay — Renders the problem statement
// Revealed on problem:reveal WebSocket event

export default function ProblemDisplay({
    statement,
    constraints,
    poisonPill,
}: {
    statement: string | null;
    constraints?: string[];
    poisonPill?: string | null;
}) {
    if (!statement) {
        return (
            <div className="border rounded-lg p-4 h-full flex items-center justify-center bg-gray-100">
                <p className="text-gray-400">Problem will be revealed shortly...</p>
            </div>
        );
    }

    // TODO: Render with react-markdown
    return (
        <div className="border rounded-lg p-4 h-full overflow-y-auto">
            <h3 className="font-bold text-lg mb-2">Problem</h3>
            <p className="text-sm">{statement}</p>
            {constraints && constraints.length > 0 && (
                <div className="mt-3">
                    <h4 className="font-semibold text-sm">Constraints:</h4>
                    <ul className="list-disc list-inside text-sm">
                        {constraints.map((c, i) => (
                            <li key={i}>{c}</li>
                        ))}
                    </ul>
                </div>
            )}
            {poisonPill && (
                <div className="mt-3 p-2 bg-amber-50 border border-amber-300 rounded">
                    <h4 className="font-semibold text-sm text-amber-700">
                        Poison Pill!
                    </h4>
                    <p className="text-sm text-amber-600">{poisonPill}</p>
                </div>
            )}
        </div>
    );
}
