"use client";

// PoisonPillTrigger — Injects additional constraint via WebSocket
// Only enabled for Quarterfinals onwards

export default function PoisonPillTrigger({
    enabled,
}: {
    enabled: boolean;
}) {
    // TODO: Text input for the poison pill constraint
    // TODO: Calls POST /api/admin/poison
    // TODO: Disabled until QF round
    return (
        <div className="border rounded-lg p-4">
            <h3 className="font-bold text-lg mb-2">Poison Pill</h3>
            <textarea
                className="border rounded p-2 w-full mb-2 text-sm"
                placeholder="Enter additional constraint..."
                disabled={!enabled}
                rows={3}
            />
            <button
                className="px-4 py-2 bg-arena-amber text-white rounded w-full disabled:opacity-50"
                disabled={!enabled}
            >
                Inject Poison Pill
            </button>
            {!enabled && (
                <p className="text-xs text-gray-400 mt-1">
                    Available from Quarterfinals onwards
                </p>
            )}
        </div>
    );
}
