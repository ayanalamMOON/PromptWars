"use client";

import { motion } from "framer-motion";
import { ChevronRight, Crown, Shield, Swords, Zap } from "lucide-react";
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
        accent: "yellow",
        cardClass: "role-card-master",
        btnClass: "btn-yellow",
        gradient: "from-yellow-500/10 to-amber-600/10",
        iconColor: "text-pw-yellow",
        borderHover: "hover:border-pw-yellow/50",
        features: ["Provide problem statements", "Control match flow", "AI-powered judging"],
    },
    {
        id: "A",
        title: "Participant A",
        subtitle: "Challenger",
        description:
            "Enter the arena as Participant A. Receive the problem from the Master, craft your best system & user prompts, and battle for the highest score.",
        icon: Swords,
        accent: "cyan",
        cardClass: "role-card-a",
        btnClass: "btn-cyan",
        gradient: "from-cyan-500/10 to-blue-600/10",
        iconColor: "text-pw-cyan",
        borderHover: "hover:border-pw-cyan/50",
        features: ["Receive battle problems", "Write system & user prompts", "Compete in real-time"],
    },
    {
        id: "B",
        title: "Participant B",
        subtitle: "Defender",
        description:
            "Enter the arena as Participant B. Face the same challenge as your opponent, and prove your prompt engineering skills are superior.",
        icon: Shield,
        accent: "magenta",
        cardClass: "role-card-b",
        btnClass: "btn-magenta",
        gradient: "from-pink-500/10 to-purple-600/10",
        iconColor: "text-pw-magenta",
        borderHover: "hover:border-pw-magenta/50",
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
            // ignore poll errors
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
        <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
            {/* Hero section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-center mb-16"
            >
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Zap className="w-8 h-8 text-pw-yellow animate-glow-pulse" />
                    <span className="badge badge-purple">GLITCH Tech Fest 2026</span>
                    <Zap className="w-8 h-8 text-pw-yellow animate-glow-pulse" />
                </div>

                <h1 className="text-6xl md:text-7xl font-black tracking-tight mb-3">
                    <span className="text-glow-purple bg-gradient-to-r from-pw-purple via-pw-cyan to-pw-magenta bg-clip-text text-transparent">
                        PROMPT WARS
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto leading-relaxed">
                    Two prompters enter. One prompt prevails.
                    <br />
                    <span className="text-slate-500">Choose your role to begin.</span>
                </p>
            </motion.div>

            {/* Role cards */}
            <div className={`grid grid-cols-1 ${visibleRoles.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"} gap-6 lg:gap-8 max-w-6xl w-full px-4`}>
                {visibleRoles.map((role, index) => {
                    const Icon = role.icon;
                    const isHovered = hoveredRole === role.id;

                    return (
                        <motion.div
                            key={role.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.15 * index }}
                            onMouseEnter={() => setHoveredRole(role.id)}
                            onMouseLeave={() => setHoveredRole(null)}
                            className={`glass-card ${role.cardClass} rounded-2xl p-8 cursor-pointer flex flex-col`}
                            onClick={() => handleSelectRole(role.id)}
                        >
                            {/* Icon */}
                            <div className={`mb-6 flex items-center gap-4`}>
                                <div
                                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center border border-white/5`}
                                >
                                    <Icon className={`w-7 h-7 ${role.iconColor}`} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{role.title}</h2>
                                    <p className={`text-sm font-medium ${role.iconColor} opacity-80`}>
                                        {role.subtitle}
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                                {role.description}
                            </p>

                            {/* Features */}
                            <ul className="space-y-2 mb-8">
                                {role.features.map((feature) => (
                                    <li
                                        key={feature}
                                        className="flex items-center gap-2 text-sm text-slate-300"
                                    >
                                        <span
                                            className={`w-1.5 h-1.5 rounded-full ${role.accent === "yellow"
                                                ? "bg-pw-yellow"
                                                : role.accent === "cyan"
                                                    ? "bg-pw-cyan"
                                                    : "bg-pw-magenta"
                                                }`}
                                        />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {/* Enter button */}
                            <button
                                className={`btn-neon ${role.btnClass} w-full flex items-center justify-center gap-2 text-sm`}
                            >
                                Enter as {role.title}
                                <ChevronRight
                                    className={`w-4 h-4 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""
                                        }`}
                                />
                            </button>
                        </motion.div>
                    );
                })}
            </div>

            {/* Footer info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="mt-16 text-center"
            >
                <p className="text-slate-600 text-sm">
                    Run this app on the Master device. Participants connect via the same network.
                </p>
                <p className="text-slate-700 text-xs mt-1 font-mono">
                    Powered by Ollama &middot; Local AI Inference
                </p>
            </motion.div>
        </main>
    );
}
