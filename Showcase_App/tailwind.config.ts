import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                pw: {
                    bg: "#0a0a1a",
                    surface: "#111127",
                    card: "#1a1a3e",
                    border: "#2a2a5e",
                    cyan: "#00e5ff",
                    magenta: "#ff00e5",
                    yellow: "#ffe500",
                    purple: "#8b5cf6",
                    green: "#00ff88",
                    red: "#ff3366",
                },
            },
            fontFamily: {
                mono: ["'JetBrains Mono'", "monospace"],
            },
            animation: {
                "glow-pulse": "glow-pulse 2s ease-in-out infinite",
                "float": "float 6s ease-in-out infinite",
                "slide-up": "slide-up 0.6s ease-out",
                "fade-in": "fade-in 0.5s ease-out",
                "border-glow": "border-glow 3s linear infinite",
            },
            keyframes: {
                "glow-pulse": {
                    "0%, 100%": { opacity: "0.6" },
                    "50%": { opacity: "1" },
                },
                "float": {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                "slide-up": {
                    "0%": { transform: "translateY(20px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                "fade-in": {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                "border-glow": {
                    "0%, 100%": { borderColor: "rgba(139, 92, 246, 0.5)" },
                    "33%": { borderColor: "rgba(0, 229, 255, 0.5)" },
                    "66%": { borderColor: "rgba(255, 0, 229, 0.5)" },
                },
            },
        },
    },
    plugins: [],
};

export default config;
