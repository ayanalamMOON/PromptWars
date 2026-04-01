import { z } from "zod";

// Zod schemas for tournament-related API request/response validation

export const GenerateBracketSchema = z.object({
    playerIds: z.array(z.string().min(1)).min(2).max(64),
});

export const AdvanceWinnerSchema = z.object({
    matchId: z.string().min(1),
    winnerId: z.string().min(1),
});

export const TournamentRoundSchema = z.enum([
    "play-in",
    "round-of-32",
    "round-of-16",
    "quarterfinal",
    "semifinal",
    "final",
]);

export type GenerateBracketInput = z.infer<typeof GenerateBracketSchema>;
export type AdvanceWinnerInput = z.infer<typeof AdvanceWinnerSchema>;
