// Timer Service — Server-side match clock management
// Phase 4: Battle Room

/**
 * Starts a match timer. Stores remaining time in Redis (match:{id}:timer).
 * Broadcasts timer:tick every second via Redis pub/sub.
 * At the engineering phase deadline, auto-submits any unsubmitted prompts.
 *
 * @param matchId - The match ID
 * @param durationSeconds - Total match duration (1200 for full, 480 for play-in)
 */
export async function startMatchTimer(
    matchId: string,
    durationSeconds: number
) {
    // TODO: Store initial time in Redis: match:{matchId}:timer = durationSeconds
    // TODO: Create setInterval (1 second) that:
    //   - Decrements Redis counter
    //   - Publishes timer:tick event via Redis pub/sub
    //   - At engineering deadline (e.g., 300s remaining for 20-min match), auto-submits
    //   - At 0, clears interval and triggers execution phase
}

/**
 * Gets the remaining time for a match from Redis.
 */
export async function getRemainingTime(matchId: string): Promise<number> {
    // TODO: Read match:{matchId}:timer from Redis
    return 0;
}

/**
 * Stops a match timer (used for pause/emergency).
 */
export async function stopMatchTimer(matchId: string) {
    // TODO: Clear the interval for this match
    // TODO: Preserve remaining time in Redis
}
