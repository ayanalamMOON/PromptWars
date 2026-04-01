import { Server, Socket } from "socket.io";

/**
 * Registers timer-related WebSocket event handlers.
 * Broadcasts timer:tick every second to match rooms.
 * Timer state is stored in Redis for consistency.
 */
export function registerTimerEvents(io: Server, socket: Socket) {
    // timer:sync — Client requests current timer state (e.g., on reconnect)
    socket.on("timer:sync", (data: { matchId: string }) => {
        // TODO: Read remaining time from Redis (match:{matchId}:timer)
        // TODO: Emit timer:tick to the requesting socket with current time
    });
}

/**
 * Starts broadcasting timer:tick events for a match.
 * Called when a match enters the engineering phase.
 */
export function startTimerBroadcast(
    io: Server,
    matchId: string,
    durationSeconds: number
) {
    // TODO: Store timer in Redis
    // TODO: setInterval every 1s: decrement, broadcast timer:tick to match room
    // TODO: At deadline: emit timer:expired, trigger auto-submit
    // TODO: At 0: clear interval
}
