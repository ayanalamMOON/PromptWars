"use client";

// RoundBadge — Displays round name as a badge

export default function RoundBadge({ round }: { round: string }) {
    return (
        <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded">
            {round}
        </span>
    );
}
