"use client";

// PromptEditor — Monaco Editor wrapper for writing prompts
// Two instances: system prompt and user prompt
// Disabled after submission

export default function PromptEditor({
    value,
    onChange,
    disabled,
}: {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}) {
    // TODO: Integrate @monaco-editor/react
    // TODO: Configure for plain text / markdown mode
    // TODO: Disable editing when disabled prop is true (after submission)
    return (
        <div className="border rounded-lg p-4 h-full">
            <textarea
                className="w-full h-full resize-none font-mono text-sm"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                placeholder="Write your prompt here..."
            />
        </div>
    );
}
