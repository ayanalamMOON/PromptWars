"use client";

// SpectatorGrid — 6-card grid showing all active matches for the audience
// Automatically switches to SpotlightMatch when <= 2 matches remain

export default function SpectatorGrid() {
    // TODO: Connect to WebSocket spectate room
    // TODO: Render up to 6 SpectatorMatchCards (one per active match)
    // TODO: Each card: player tags, live output preview (truncated 200 chars), phase indicator
    // TODO: Auto-switch to SpotlightMatch when SF/Final
    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            <p className="text-gray-400 col-span-full text-center">
                Spectator grid — active matches will appear here
            </p>
        </div>
    );
}
