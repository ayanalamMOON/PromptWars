// Tournament Service — Bracket generation, wave scheduling, winner advancement
// Phase 1: Core tournament engine logic

/**
 * Generates a single-elimination bracket for the given players.
 * Uses Fisher-Yates shuffle for randomization.
 * For 50 players: 36 play in Play-In (18 matches), 14 get byes.
 */
export function generateBracket(playerIds: string[]) {
    // TODO: Fisher-Yates shuffle playerIds
    // TODO: Calculate bracketSize (next power of 2 >= playerIds.length)
    // TODO: Calculate byes = bracketSize - playerIds.length
    // TODO: Build Play-In matches from non-bye players
    // TODO: Build subsequent rounds: R32, R16, QF, SF, Final
    // TODO: Return bracket object with all matches
    return {
        totalPlayers: playerIds.length,
        bracketSize: 0,
        byes: 0,
        rounds: 0,
        matches: [],
    };
}

/**
 * Splits matches in a round into waves of at most `stationCount` parallel matches.
 */
export function computeWaves(
    roundMatches: { matchId: string }[],
    stationCount: number = 6
) {
    // TODO: Chunk roundMatches into groups of stationCount
    const waves: { matchId: string }[][] = [];
    for (let i = 0; i < roundMatches.length; i += stationCount) {
        waves.push(roundMatches.slice(i, i + stationCount));
    }
    return waves;
}

/**
 * Advances the winner of a match in the bracket.
 * Updates the bracket: sets winner, identifies next match, marks it as ready.
 */
export async function advanceWinner(matchId: string, winnerId: string) {
    // TODO: Update Match document with winnerId
    // TODO: Find the next match in the bracket where this winner should be placed
    // TODO: If next match has both players, mark it as "ready"
    // TODO: If this was the Final, set tournament champion
}

/**
 * Returns all active matches in the current wave.
 */
export async function getCurrentWave(tournamentId: string) {
    // TODO: Query Tournament for currentWave
    // TODO: Return all matches in that wave
    return [];
}
