import Redis from "ioredis";
import { Server } from "socket.io";

/**
 * Subscribes to Redis pub/sub channels and relays events to WebSocket clients.
 * This bridges the serverless Next.js API routes with the persistent WebSocket server.
 *
 * API routes publish events to Redis -> this subscriber relays to Socket.IO rooms.
 */
export function setupRedisSubscriber(io: Server) {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
        console.warn("REDIS_URL not set — Redis subscriber disabled");
        return;
    }

    const subscriber = new Redis(redisUrl);

    subscriber.subscribe("match:events", (err) => {
        if (err) {
            console.error("Failed to subscribe to match:events:", err);
            return;
        }
        console.log("Subscribed to Redis channel: match:events");
    });

    subscriber.on("message", (channel: string, message: string) => {
        try {
            const event = JSON.parse(message);
            const { type, matchId, ...data } = event;

            // Relay to the specific match room
            if (matchId) {
                io.to(`match:${matchId}`).emit(type, data);
            }

            // Mirror relevant events to spectators
            const spectatorEvents = [
                "output:stream",
                "verdict:announce",
                "bracket:update",
                "problem:reveal",
                "execution:start",
            ];

            if (spectatorEvents.includes(type)) {
                io.to("spectate").emit(type, { matchId, ...data });
            }

            // Bracket updates go to bracket room too
            if (type === "bracket:update") {
                io.to("bracket").emit(type, data);
            }

            // Admin notifications
            if (type === "verdict:announce" || type === "match:error") {
                io.to("admin").emit(type, { matchId, ...data });
            }
        } catch (err) {
            console.error("Failed to parse Redis message:", err);
        }
    });
}
