"use client";

// CountdownTimer — Server-synced countdown timer
// Receives timer:tick events from WebSocket, displays remaining time

export default function CountdownTimer({
    remainingSeconds,
}: {
    remainingSeconds: number;
}) {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    // TODO: Use useTimer hook for server-synced countdown
    // TODO: Flash red when under 60 seconds
    return (
        <div
            className={`text-2xl font-mono font-bold ${remainingSeconds < 60 ? "text-arena-red" : "text-primary"
                }`}
        >
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>
    );
}
