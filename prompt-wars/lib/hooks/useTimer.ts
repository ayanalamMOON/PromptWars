"use client";

import { useEffect, useState } from "react";

// useTimer — Server-synced countdown hook
// Listens to timer:tick events from WebSocket and displays remaining time

export function useTimer(socket: any) {
    const [remainingSeconds, setRemainingSeconds] = useState(0);

    useEffect(() => {
        if (!socket) return;

        const handler = (data: { remaining: number }) => {
            setRemainingSeconds(data.remaining);
        };

        socket.on("timer:tick", handler);
        return () => {
            socket.off("timer:tick", handler);
        };
    }, [socket]);

    return { remainingSeconds };
}
