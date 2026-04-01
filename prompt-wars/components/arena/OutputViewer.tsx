"use client";

// OutputViewer — Displays streamed LLM output with markdown rendering
// Receives tokens from output:stream WebSocket events

export default function OutputViewer({ output }: { output: string }) {
    // TODO: Render streamed tokens with react-markdown
    // TODO: Auto-scroll to bottom as tokens arrive
    return (
        <div className="border rounded-lg p-4 h-full overflow-y-auto bg-gray-50">
            <pre className="whitespace-pre-wrap text-sm">{output || "Waiting for execution..."}</pre>
        </div>
    );
}
