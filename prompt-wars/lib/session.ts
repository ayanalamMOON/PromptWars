import { SessionOptions } from "iron-session";

export interface SessionData {
    role: "player" | "admin" | "spectator";
    userId?: string;
    stationId?: string;
    battleTag?: string;
}

export const sessionOptions: SessionOptions = {
    password: process.env.SESSION_SECRET!,
    cookieName: "promptwars-session",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax" as const,
    },
};
