import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Prompt Wars: The Arena | GLITCH Tech Fest 2026",
    description:
        "Head-to-head AI prompt engineering tournament platform for GLITCH Tech Fest 2026",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
