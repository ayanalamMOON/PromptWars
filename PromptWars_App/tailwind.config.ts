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
                    bg: "#09090b",
                    surface: "#18181b",
                    card: "#1c1c22",
                    border: "#2a2a35",
                    red: "#ef4444",
                    "red-dark": "#b91c1c",
                    green: "#22c55e",
                    "green-dark": "#15803d",
                    gold: "#fbbf24",
                    "gold-dark": "#d97706",
                    muted: "#a3a3a3",
                    accent: "#e53e3e",
                },
            },
            fontFamily: {
                mono: ["var(--pw-font-code)", "ui-monospace", "SFMono-Regular", "monospace"],
                sans: ["var(--pw-font-body)", "system-ui", "sans-serif"],
                display: ["var(--pw-font-display)", "sans-serif"],
                ui: ["var(--pw-font-ui)", "sans-serif"],
            },
            animation: {
                "glow-pulse": "glow-pulse 2s ease-in-out infinite",
                "float": "float 6s ease-in-out infinite",
                "slide-up": "slide-up 0.6s ease-out",
                "fade-in": "fade-in 0.5s ease-out",
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
            },
        },
    },
    plugins: [],
};

export default config;
