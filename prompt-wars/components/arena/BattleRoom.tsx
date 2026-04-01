"use client";

// BattleRoom — Full match room layout
// Combines: ProblemDisplay, PromptEditor, OutputViewer, CountdownTimer, VerdictOverlay
// Connects to WebSocket room match:{matchId} on mount

export default function BattleRoom({ matchId }: { matchId: string }) {
    // TODO: Connect to WebSocket room via useSocket hook
    // TODO: Listen for problem:reveal, timer:tick, output:stream, verdict:announce
    // TODO: Layout: top bar (match ID, player tags, timer), problem panel, editor, output viewer
    // TODO: Bottom bar: Test Run button, Submit Final button
    return (
        <div className="grid grid-cols-3 gap-4 h-full">
            <div>{/* Problem panel */}</div>
            <div>{/* Prompt editor */}</div>
            <div>{/* Output viewer */}</div>
        </div>
    );
}
