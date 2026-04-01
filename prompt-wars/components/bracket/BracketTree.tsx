"use client";

// BracketTree — Full tournament bracket visualization
// Subscribes to bracket:update via WebSocket
// Highlights: active (amber), completed (green), upcoming (blue)

export default function BracketTree() {
    // TODO: Fetch bracket data from /api/tournament/bracket
    // TODO: Subscribe to bracket:update WebSocket events
    // TODO: Render bracket rounds: Play-In, R32, R16, QF, SF, Final
    return (
        <div className="w-full overflow-x-auto p-4">
            <p className="text-gray-400">Bracket tree will be rendered here</p>
        </div>
    );
}
