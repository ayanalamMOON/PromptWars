import { Schema, model, models } from "mongoose";

const MatchSchema = new Schema(
    {
        matchNumber: { type: Number, required: true },
        round: {
            type: String,
            enum: ["play-in", "round-of-32", "round-of-16", "quarterfinal", "semifinal", "final"],
            required: true,
        },
        wave: { type: Number },
        station: { type: String },
        status: {
            type: String,
            enum: ["pending", "ready", "active", "executing", "judging", "completed"],
            default: "pending",
        },
        playerA: { type: Schema.Types.ObjectId, ref: "User" },
        playerB: { type: Schema.Types.ObjectId, ref: "User" },
        problem: { type: Schema.Types.ObjectId, ref: "Problem" },
        submissions: {
            a: {
                systemPrompt: { type: String },
                userPrompt: { type: String },
                submittedAt: { type: Date },
                isAutoSubmitted: { type: Boolean, default: false },
            },
            b: {
                systemPrompt: { type: String },
                userPrompt: { type: String },
                submittedAt: { type: Date },
                isAutoSubmitted: { type: Boolean, default: false },
            },
        },
        outputs: {
            a: { type: String },
            b: { type: String },
        },
        verdict: {
            winner: { type: String, enum: ["A", "B"] },
            scoreA: { type: Number },
            scoreB: { type: Number },
            justification: { type: String },
            judgeModel: { type: String },
            isOverridden: { type: Boolean, default: false },
            overrideReason: { type: String },
        },
        timing: {
            startedAt: { type: Date },
            revealedAt: { type: Date },
            executedAt: { type: Date },
            completedAt: { type: Date },
        },
        winnerId: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

export default models.Match || model("Match", MatchSchema);
