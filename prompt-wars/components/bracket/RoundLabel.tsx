"use client";

// RoundLabel — Displays round name in the bracket view

export default function RoundLabel({ name }: { name: string }) {
    return (
        <div className="text-center py-2">
            <span className="text-sm font-bold text-primary uppercase tracking-wide">
                {name}
            </span>
        </div>
    );
}
