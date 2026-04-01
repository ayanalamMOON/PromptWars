"use client";

// WaveControlPanel — Shows all current-wave match statuses
// Buttons: Start Wave, Pause, Force Advance

export default function WaveControlPanel() {
    // TODO: Fetch current wave matches from API
    // TODO: Display match status cards
    // TODO: Implement Start Wave, Pause, Force Advance buttons
    return (
        <div className="border rounded-lg p-4">
            <h3 className="font-bold text-lg mb-2">Wave Control</h3>
            <div className="flex gap-2">
                <button className="px-4 py-2 bg-arena-green text-white rounded">
                    Start Wave
                </button>
                <button className="px-4 py-2 bg-arena-amber text-white rounded">
                    Pause
                </button>
                <button className="px-4 py-2 bg-arena-red text-white rounded">
                    Force Advance
                </button>
            </div>
        </div>
    );
}
