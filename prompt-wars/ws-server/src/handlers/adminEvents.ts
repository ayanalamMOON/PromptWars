import { Server, Socket } from "socket.io";

/**
 * Registers admin/Game Master WebSocket event handlers.
 * Events: wave:advance, poison:inject, match:override
 */
export function registerAdminEvents(io: Server, socket: Socket) {
    // wave:advance — Game Master starts the next wave
    socket.on("wave:advance", (data: { waveNumber: number }) => {
        // TODO: Validate admin role
        // TODO: Notify all relevant match rooms
        io.to("admin").emit("wave:started", { waveNumber: data.waveNumber });
    });

    // poison:inject — Game Master injects a poison pill constraint
    socket.on(
        "poison:inject",
        (data: { matchIds: string[]; constraint: string }) => {
            // TODO: Validate admin role
            // TODO: Validate round is QF or later
            for (const matchId of data.matchIds) {
                io.to(`match:${matchId}`).emit("poison:inject", {
                    constraint: data.constraint,
                });
            }
        }
    );

    // match:override — Game Master overrides a match verdict
    socket.on(
        "match:override",
        (data: { matchId: string; winnerId: string; reason: string }) => {
            // TODO: Validate admin role
            // TODO: Update via API, then broadcast
            io.to(`match:${data.matchId}`).emit("verdict:overridden", {
                winnerId: data.winnerId,
                reason: data.reason,
            });
        }
    );
}
