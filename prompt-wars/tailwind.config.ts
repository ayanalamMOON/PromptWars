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
                primary: "#1A3C6E",
                accent: "#D4A843",
                arena: {
                    blue: "#2C5F9E",
                    green: "#27AE60",
                    red: "#C0392B",
                    amber: "#F39C12",
                    purple: "#8E44AD",
                },
            },
        },
    },
    plugins: [],
};

export default config;
