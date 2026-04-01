// Station Service — Station authentication and assignment logic
// Phase 2: Station Auth & Check-In

/**
 * Assigns a player to a station.
 * Called by the Game Master during check-in.
 */
export async function assignPlayerToStation(
    playerId: string,
    stationId: string
) {
    // TODO: Update User document: station.stationId, station.assignedAt, station.isActive
    // TODO: Update User isCheckedIn = true
    // TODO: Return updated user
}

/**
 * Gets the current player assigned to a station.
 */
export async function getStationPlayer(stationId: string) {
    // TODO: Query User model where station.stationId === stationId and station.isActive
    // TODO: Return player info or null
    return null;
}

/**
 * Releases a player from a station (e.g., after elimination or hardware failure).
 */
export async function releaseStation(stationId: string) {
    // TODO: Find user with this station, set station.isActive = false
    // TODO: Return released user info
}

/**
 * Seeds the 12 station records: S1-A, S1-B, S2-A, S2-B, ... S6-A, S6-B
 */
export function getStationIds(): string[] {
    const stations: string[] = [];
    for (let i = 1; i <= 6; i++) {
        stations.push(`S${i}-A`, `S${i}-B`);
    }
    return stations;
}
