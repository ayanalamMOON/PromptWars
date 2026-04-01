"use client";

// PlayerTag — Battle Tag badge component

export default function PlayerTag({
    tag,
    isWinner,
}: {
    tag: string;
    isWinner?: boolean;
}) {
    return (
        <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${isWinner
                    ? "bg-arena-green text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
        >
            {tag}
        </span>
    );
}
