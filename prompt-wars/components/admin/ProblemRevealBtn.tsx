"use client";

// ProblemRevealBtn — Dropdown of problems from the bank + Reveal button
// Broadcasts problem:reveal via WebSocket to all active battle rooms

export default function ProblemRevealBtn() {
    // TODO: Fetch problems from /api/admin/problem filtered by current round
    // TODO: Dropdown select + Reveal button
    // TODO: Calls POST /api/admin/problem/reveal
    return (
        <div className="border rounded-lg p-4">
            <h3 className="font-bold text-lg mb-2">Problem Reveal</h3>
            <select className="border rounded p-2 w-full mb-2">
                <option>Select a problem...</option>
            </select>
            <button className="px-4 py-2 bg-primary text-white rounded w-full">
                Reveal Problem
            </button>
        </div>
    );
}
