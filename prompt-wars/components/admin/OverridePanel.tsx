"use client";

// OverridePanel — Manually set match winner
// Requires typing "CONFIRM" to prevent accidents

export default function OverridePanel() {
    // TODO: Select a match from dropdown
    // TODO: Select winner (Player A or Player B)
    // TODO: Require typing "CONFIRM" before allowing override
    // TODO: Calls POST /api/match/[id]/override
    return (
        <div className="border rounded-lg p-4 border-arena-red">
            <h3 className="font-bold text-lg mb-2 text-arena-red">
                Override Verdict
            </h3>
            <select className="border rounded p-2 w-full mb-2">
                <option>Select match...</option>
            </select>
            <select className="border rounded p-2 w-full mb-2">
                <option>Select winner...</option>
            </select>
            <input
                className="border rounded p-2 w-full mb-2 text-sm"
                placeholder='Type "CONFIRM" to override'
            />
            <button className="px-4 py-2 bg-arena-red text-white rounded w-full">
                Override
            </button>
        </div>
    );
}
