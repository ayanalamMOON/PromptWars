"use client";

import { motion } from "framer-motion";
import {
    ArrowLeft,
    CheckCircle2,
    Gavel,
    ShieldAlert,
    Sparkles,
    Target,
} from "lucide-react";
import { useRouter } from "next/navigation";

const battleRules = [
    "Two participants (A and B) receive the same problem statement.",
    "Each participant submits exactly one System Prompt and one User Prompt.",
    "Submissions are evaluated using the same model/runtime configuration.",
    "Once submitted, prompts are locked for that round.",
    "Master controls round start/reset and oversees the live session.",
];

const criteria = [
    {
        title: "Task Accuracy",
        detail: "How correctly and completely the output solves the given problem.",
        icon: Target,
        accent: "badge-green",
    },
    {
        title: "Reasoning Quality",
        detail: "Whether the response demonstrates clear, coherent, and relevant reasoning.",
        icon: Sparkles,
        accent: "badge-gold",
    },
    {
        title: "Instruction Adherence",
        detail: "How faithfully the model follows the constraints and intent of the prompt.",
        icon: Gavel,
        accent: "badge-red",
    },
];

const disqualifiers = [
    "Prompt-injection or jailbreak attempts in submitted prompts.",
    "Malicious instructions intended to break evaluation fairness.",
    "Content that violates event safety constraints.",
];

export default function RulesPage() {
    const router = useRouter();

    return (
        <main className="min-h-screen px-4 py-10 max-w-5xl mx-auto relative z-[1]">
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-between mb-8"
            >
                <button
                    onClick={() => router.push("/")}
                    className="flex items-center gap-2 text-neutral-500 hover:text-neutral-300 transition-colors text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
                <div className="text-center">
                    <h1 className="font-display text-3xl md:text-4xl font-black tracking-tight text-glow-red bg-gradient-to-r from-pw-red via-red-400 to-pw-gold bg-clip-text text-transparent">
                        Rules & Success Criteria
                    </h1>
                    <p className="text-pw-muted text-sm mt-2">
                        Fair play standards and how winners are decided.
                    </p>
                </div>
                <div className="w-20" />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.section
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.55 }}
                    className="glass-card rounded-2xl p-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <span className="badge badge-red">Battle Rules</span>
                    </div>
                    <ul className="space-y-3">
                        {battleRules.map((rule) => (
                            <li key={rule} className="flex items-start gap-3 text-sm text-neutral-300 leading-relaxed">
                                <CheckCircle2 className="w-4 h-4 text-pw-green mt-0.5 shrink-0" />
                                <span>{rule}</span>
                            </li>
                        ))}
                    </ul>
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.16, duration: 0.55 }}
                    className="glass-card rounded-2xl p-6"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <span className="badge badge-gold">How Success Is Measured</span>
                    </div>

                    <div className="space-y-4">
                        {criteria.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.title} className="rounded-xl border border-pw-gold/15 bg-pw-gold/5 p-4">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <Icon className="w-4 h-4 text-pw-gold" />
                                        <span className={`font-ui badge ${item.accent}`}>{item.title}</span>
                                    </div>
                                    <p className="text-sm text-neutral-300">{item.detail}</p>
                                </div>
                            );
                        })}
                    </div>
                </motion.section>
            </div>

            <motion.section
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24, duration: 0.55 }}
                className="glass-card rounded-2xl p-6 mt-6"
            >
                <div className="flex items-center gap-2 mb-4">
                    <ShieldAlert className="w-5 h-5 text-pw-red" />
                    <span className="badge badge-red">Disqualification Triggers</span>
                </div>
                <ul className="space-y-2.5 text-sm text-neutral-300">
                    {disqualifiers.map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-pw-red mt-2" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </motion.section>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.45 }}
                className="mt-8 text-center"
            >
                <button
                    onClick={() => router.push("/")}
                    className="btn-neon btn-gold px-6 py-3"
                >
                    Back to Role Selection
                </button>
            </motion.div>
        </main>
    );
}
