"use client";

// SystemHealth — Live counts of WebSocket connections, Redis pings, recent API errors

export default function SystemHealth() {
    // TODO: Poll GET /api/health periodically
    // TODO: Display WebSocket connection count, Redis status, recent errors
    return (
        <div className="border rounded-lg p-4">
            <h3 className="font-bold text-lg mb-2">System Health</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-2xl font-bold text-arena-green">--</p>
                    <p className="text-xs text-gray-500">WS Connections</p>
                </div>
                <div>
                    <p className="text-2xl font-bold text-arena-green">--</p>
                    <p className="text-xs text-gray-500">Redis Ping</p>
                </div>
                <div>
                    <p className="text-2xl font-bold text-arena-green">--</p>
                    <p className="text-xs text-gray-500">API Errors</p>
                </div>
            </div>
        </div>
    );
}
