import { Schema, model, models } from "mongoose";

const TournamentSchema = new Schema(
    {
        name: { type: String, required: true },
        status: {
            type: String,
            enum: ["setup", "active", "paused", "completed"],
            default: "setup",
        },
        config: {
            maxParticipants: { type: Number, default: 50 },
            stations: { type: Number, default: 6 },
            matchDuration: { type: Number, default: 1200 }, // seconds (20 min)
            playInDuration: { type: Number, default: 480 }, // seconds (8 min)
            frozenModel: { type: String, default: "llama-3.3-70b-versatile" },
            judgeModel: { type: String, default: "gemini-2.0-flash" },
        },
        bracket: {
            totalPlayers: { type: Number },
            bracketSize: { type: Number },
            byes: { type: Number },
            rounds: { type: Number },
            matches: [{ type: Schema.Types.ObjectId, ref: "Match" }],
        },
        currentRound: { type: String },
        currentWave: { type: Number, default: 0 },
        championId: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

export default models.Tournament || model("Tournament", TournamentSchema);
