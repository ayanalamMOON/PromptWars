import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
    {
        battleTag: { type: String, required: true, unique: true },
        universityId: { type: String },
        role: {
            type: String,
            enum: ["player", "admin", "spectator"],
            default: "player",
        },
        playerNumber: { type: Number },
        station: {
            stationId: { type: String },
            assignedAt: { type: Date },
            isActive: { type: Boolean, default: false },
        },
        isCheckedIn: { type: Boolean, default: false },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid"],
            default: "pending",
        },
        stats: {
            wins: { type: Number, default: 0 },
            avgScore: { type: Number, default: 0 },
        },
    },
    { timestamps: true }
);

export default models.User || model("User", UserSchema);
