"use client";

// MatchFeedTicker — Scrolling bottom bar showing recent verdicts
// e.g., "P12 defeats P37 — 82 vs 64 — Round of 32"

export default function MatchFeedTicker() {
    // TODO: Subscribe to verdict:announce events
    // TODO: Display scrolling ticker of recent results
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-primary text-white py-2 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
                <span className="mx-8 text-sm">
                    Match results will appear here as they are announced...
                </span>
            </div>
        </div>
    );
}
