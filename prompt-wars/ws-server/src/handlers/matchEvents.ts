import { Server, Socket } from "socket.io";

/**
 * Registers match-related WebSocket event handlers.
 * Events: match:start, problem:reveal, prompt:test, prompt:submit,
 *         execution:start, output:stream, verdict:announce
 */
export function registerMatchEvents(io: Server, socket: Socket) {
    // match:start — Triggered when a match begins
    socket.on("match:start", (data: { matchId: string }) => {
        // TODO: Initialize match state, notify both players
        io.to(`match:${data.matchId}`).emit("match:started", {
            matchId: data.matchId,
            timestamp: new Date().toISOString(),
        });
    });

    // prompt:test — Player requests a test run of their prompt
    socket.on("prompt:test", (data: { matchId: string; prompt: string }) => {
        // TODO: Forward to API route for execution, rate limit check
        // Response comes back via Redis pub/sub
    });

    // prompt:submit — Player submits their final prompt
    socket.on("prompt:submit", (data: { matchId: string; playerId: string }) => {
        // TODO: Notify the match room that a player has submitted
        io.to(`match:${data.matchId}`).emit("player:submitted", {
            playerId: data.playerId,
        });
    });
}
