import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Orbitron, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

const orbitron = Orbitron({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-orbitron",
});

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-space-grotesk",
});

const jetBrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
    title: "Prompt Wars — GLITCH Tech Fest 2026",
    description: "PromptWars: AI Prompt Battle Arena for GLITCH Tech Fest 2026",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${orbitron.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable} min-h-screen bg-pw-bg text-pw-gold antialiased`}>
                {/* Ambient background layers */}
                <div className="orb orb-red" />
                <div className="orb orb-green" />
                <div className="orb orb-gold" />
                <div className="orb orb-red-sm" />
                <div className="orb orb-green-sm" />
                <div className="noise-overlay" />
                <div className="scan-line" />
                <div className="scan-line-h" />
                <div className="light-streak streak-1" />
                <div className="light-streak streak-2" />
                <div className="light-streak streak-3" />
                <div className="particles">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="particle" style={{
                            left: `${(i * 5.26) % 100}%`,
                            animationDelay: `${(i * 0.7) % 14}s`,
                            animationDuration: `${8 + (i % 7) * 2}s`,
                            width: `${3 + (i % 3) * 2}px`,
                            height: `${3 + (i % 3) * 2}px`,
                            opacity: 0.4 + (i % 5) * 0.1,
                        }} />
                    ))}
                </div>
                <div className="vignette" />

                <div className="bg-grid bg-radial-glow min-h-screen relative z-[1]">
                    {children}
                </div>
            </body>
        </html>
    );
}
