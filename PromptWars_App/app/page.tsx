"use client";

import { motion } from "framer-motion";
import { ChevronRight, Crown, ScrollText, Shield, Swords, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const roles = [
    {
        id: "master",
        title: "Master",
        subtitle: "Judge & Controller",
        description:
            "Host the battle. Provide the problem statement, watch both participants submit their prompts, and let the AI judge declare the winner.",
        icon: Crown,
        accent: "red",
        cardClass: "role-card-master",
        btnClass: "btn-red",
        gradient: "from-red-500/10 to-red-700/10",
        iconColor: "text-pw-red",
        features: ["Provide problem statements", "Control match flow", "AI-powered judging"],
    },
    {
        id: "A",
        title: "Participant A",
        subtitle: "Challenger",
        description:
            "Enter the arena as Participant A. Receive the problem from the Master, craft your best system & user prompts, and battle for the highest score.",
        icon: Swords,
        accent: "green",
        cardClass: "role-card-a",
        btnClass: "btn-cyan",
        gradient: "from-green-500/10 to-emerald-600/10",
        iconColor: "text-pw-green",
        features: ["Receive battle problems", "Write system & user prompts", "Compete in real-time"],
    },
    {
        id: "B",
        title: "Participant B",
        subtitle: "Defender",
        description:
            "Enter the arena as Participant B. Face the same challenge as your opponent, and prove your prompt engineering skills are superior.",
        icon: Shield,
        accent: "gold",
        cardClass: "role-card-b",
        btnClass: "btn-gold",
        gradient: "from-pw-gold/10 to-amber-600/10",
        iconColor: "text-pw-gold",
        features: ["Same problem, different approach", "Craft winning prompts", "Head-to-head battle"],
    },
];

export default function HomePage() {
    const router = useRouter();
    const [hoveredRole, setHoveredRole] = useState<string | null>(null);
    const [masterConnected, setMasterConnected] = useState(false);

    const pollStatus = useCallback(async () => {
        try {
            const res = await fetch("/api/status");
            if (res.ok) {
                const data = await res.json();
                setMasterConnected(!!data.masterConnected);
            }
        } catch {
            // ignore
        }
    }, []);

    useEffect(() => {
        pollStatus();
        const interval = setInterval(pollStatus, 3000);
        return () => clearInterval(interval);
    }, [pollStatus]);

    const visibleRoles = masterConnected
        ? roles.filter((r) => r.id !== "master")
        : roles;

    function handleSelectRole(roleId: string) {
        if (roleId === "master") {
            router.push("/master");
        } else {
            router.push(`/participant/${roleId}`);
        }
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative">
            {/* Hero */}
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-center mb-16"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex items-center justify-center gap-3 mb-6"
                >
                    <Zap className="w-8 h-8 text-pw-red animate-glow-pulse" />
                    <span className="badge badge-red">GLITCH Tech Fest 2026</span>
                    <Zap className="w-8 h-8 text-pw-red animate-glow-pulse" />
                </motion.div>

                <h1 className="font-display text-6xl md:text-8xl font-black tracking-tighter mb-4">
                    <span className="text-glow-red bg-gradient-to-r from-pw-red via-red-400 to-pw-gold bg-clip-text text-transparent">
                        PROMPT WARS
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-pw-muted max-w-xl mx-auto leading-relaxed mb-6">
                    Two prompters enter. One prompt prevails.
                    <br />
                    <span className="text-neutral-500">Choose your role to begin.</span>
                </p>

                {/* Decorative divider */}
                <div className="flex items-center justify-center gap-3 opacity-30">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-pw-red" />
                    <div className="w-1.5 h-1.5 rounded-full bg-pw-red" />
                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-pw-red" />
                </div>

                <motion.button
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.45 }}
                    onClick={() => router.push("/rules")}
                    className="btn-neon btn-gold mt-7 inline-flex items-center gap-2"
                >
                    <ScrollText className="w-4 h-4" />
                    Rules & Success Criteria
                </motion.button>
            </motion.div>

            {/* Role cards */}
            <div className={`grid grid-cols-1 ${visibleRoles.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"} gap-6 lg:gap-8 max-w-6xl w-full px-4`}>
                {visibleRoles.map((role, index) => {
                    const Icon = role.icon;
                    const isHovered = hoveredRole === role.id;

                    return (
                        <motion.div
                            key={role.id}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.15 * index, ease: [0.16, 1, 0.3, 1] }}
                            whileHover={{ y: -6, transition: { duration: 0.3 } }}
                            whileTap={{ scale: 0.98 }}
                            onMouseEnter={() => setHoveredRole(role.id)}
                            onMouseLeave={() => setHoveredRole(null)}
                            className={`glass-card ${role.cardClass} rounded-2xl p-8 cursor-pointer flex flex-col group`}
                            onClick={() => handleSelectRole(role.id)}
                        >
                            <div className="mb-6 flex items-center gap-4">
                                <div
                                    className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center border border-pw-gold/10 transition-all duration-300 group-hover:border-pw-gold/25`}
                                >
                                    <Icon className={`w-7 h-7 ${role.iconColor} transition-transform duration-300 group-hover:scale-110`} />
                                </div>
                                <div>
                                    <h2 className="font-ui text-2xl font-bold text-pw-gold">{role.title}</h2>
                                    <p className={`text-sm font-medium ${role.iconColor} opacity-80`}>
                                        {role.subtitle}
                                    </p>
                                </div>
                            </div>

                            <p className="text-pw-muted text-sm leading-relaxed mb-6 flex-1">
                                {role.description}
                            </p>

                            <ul className="space-y-2.5 mb-8">
                                {role.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-2.5 text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">
                                        <span
                                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${role.accent === "red"
                                                ? "bg-pw-red group-hover:shadow-[0_0_6px_rgba(239,68,68,0.6)]"
                                                : role.accent === "green"
                                                    ? "bg-pw-green group-hover:shadow-[0_0_6px_rgba(34,197,94,0.6)]"
                                                    : "bg-pw-gold group-hover:shadow-[0_0_8px_rgba(251,191,36,0.55)]"
                                                }`}
                                        />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`btn-neon ${role.btnClass} w-full flex items-center justify-center gap-2 text-sm`}
                            >
                                Enter as {role.title}
                                <ChevronRight
                                    className={`w-4 h-4 transition-transform duration-300 ${isHovered ? "translate-x-1.5" : ""}`}
                                />
                            </button>
                        </motion.div>
                    );
                })}
            </div>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="mt-16 text-center"
            >
                <div className="flex items-center justify-center gap-3 mb-3 opacity-20">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-neutral-600" />
                    <div className="w-1 h-1 rounded-full bg-neutral-600" />
                    <div className="h-px w-12 bg-gradient-to-l from-transparent to-neutral-600" />
                </div>
                <p className="text-neutral-500 text-sm">
                    Run this app on the Master device. Participants connect via the same network.
                </p>
                <p className="text-neutral-600 text-xs mt-1.5 font-mono tracking-wider">
                    Powered by Ollama &middot; Local AI Inference
                </p>
            </motion.div>
        </main>
    );
}
