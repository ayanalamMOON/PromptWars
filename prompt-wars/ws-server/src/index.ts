import http from "http";
import { Server } from "socket.io";
import { registerAdminEvents } from "./handlers/adminEvents";
import { registerMatchEvents } from "./handlers/matchEvents";
import { registerTimerEvents } from "./handlers/timerEvents";
import { setupRedisSubscriber } from "./redisSubscriber";

const server = http.createServer();

const io = new Server(server, {
    cors: {
        origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"],
        methods: ["GET", "POST"],
    },
});

// Socket.IO connection handler
io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Join match room
    socket.on("join:match", (matchId: string) => {
        socket.join(`match:${matchId}`);
        console.log(`${socket.id} joined match:${matchId}`);
    });

    // Join spectator room
    socket.on("join:spectate", () => {
        socket.join("spectate");
        console.log(`${socket.id} joined spectate`);
    });

    // Join bracket room
    socket.on("join:bracket", () => {
        socket.join("bracket");
        console.log(`${socket.id} joined bracket`);
    });

    // Join admin room (requires token verification)
    socket.on("join:admin", (token: string) => {
        // TODO: Verify admin token
        socket.join("admin");
        console.log(`${socket.id} joined admin`);
    });

    // Register event handlers
    registerMatchEvents(io, socket);
    registerTimerEvents(io, socket);
    registerAdminEvents(io, socket);

    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// Setup Redis subscriber to relay events from API routes to WebSocket clients
setupRedisSubscriber(io);

const port = process.env.WS_PORT ? Number(process.env.WS_PORT) : 4000;
server.listen(port, () => {
    console.log(`WebSocket server listening on port ${port}`);
});
