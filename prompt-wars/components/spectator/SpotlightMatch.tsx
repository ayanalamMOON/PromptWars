"use client";

// SpotlightMatch — Full-screen single match view for SF/Final
// Animated token streaming for the audience

export default function SpotlightMatch({
    matchId,
}: {
    matchId: string;
}) {
    // TODO: Connect to WebSocket match room
    // TODO: Full-screen layout with animated token streaming
    // TODO: Side-by-side output display for both players
    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <p className="text-gray-400">
                Spotlight view for match {matchId}
            </p>
        </div>
    );
}
