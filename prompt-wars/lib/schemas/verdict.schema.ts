import { z } from "zod";

// Zod schema for AI judge verdict validation

export const VerdictSchema = z.object({
    winner: z.enum(["A", "B"]),
    score_a: z.number().min(0).max(100),
    score_b: z.number().min(0).max(100),
    justification: z.string().min(1).max(1000),
});

export type Verdict = z.infer<typeof VerdictSchema>;
