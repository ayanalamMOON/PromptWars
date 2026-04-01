import { z } from "zod";

// Zod schemas for match-related API request/response validation

export const SubmitPromptSchema = z.object({
    systemPrompt: z.string().min(1).max(10000),
    userPrompt: z.string().min(1).max(10000),
});

export const TestRunSchema = z.object({
    systemPrompt: z.string().min(1).max(10000),
    userPrompt: z.string().min(1).max(10000),
});

export const OverrideSchema = z.object({
    winnerId: z.string().min(1),
    reason: z.string().min(1).max(500),
    confirmText: z.literal("CONFIRM"),
});

export const MatchStatusSchema = z.enum([
    "pending",
    "ready",
    "active",
    "executing",
    "judging",
    "completed",
]);

export type SubmitPromptInput = z.infer<typeof SubmitPromptSchema>;
export type TestRunInput = z.infer<typeof TestRunSchema>;
export type OverrideInput = z.infer<typeof OverrideSchema>;
