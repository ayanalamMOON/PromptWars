import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Prompt Wars — Showcase",
    description: "PromptWars live showcase for GLITCH Tech Fest 2026",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-pw-bg text-slate-200 antialiased">
                <div className="bg-grid bg-radial-glow min-h-screen">
                    {children}
                </div>
            </body>
        </html>
    );
}
