"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

// useSocket — WebSocket connection hook
// Manages Socket.IO connection to the standalone WebSocket server

export function useSocket(room?: string) {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:4000";
        const socket = io(wsUrl, { transports: ["websocket"] });
        socketRef.current = socket;

        socket.on("connect", () => {
            setIsConnected(true);
            if (room) {
                socket.emit(`join:${room.includes("match") ? "match" : room}`, room);
            }
        });

        socket.on("disconnect", () => setIsConnected(false));

        return () => {
            socket.disconnect();
        };
    }, [room]);

    return { socket: socketRef.current, isConnected };
}
