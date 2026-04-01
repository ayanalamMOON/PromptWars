import { Schema, model, models } from "mongoose";

const ProblemSchema = new Schema(
    {
        round: {
            type: String,
            enum: ["play-in", "round-of-32", "round-of-16", "quarterfinal", "semifinal", "final"],
            required: true,
        },
        title: { type: String, required: true },
        statement: { type: String, required: true },
        constraints: [{ type: String }],
        poisonPill: { type: String },
        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard", "expert"],
            default: "medium",
        },
        isRevealed: { type: Boolean, default: false },
        createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

export default models.Problem || model("Problem", ProblemSchema);
