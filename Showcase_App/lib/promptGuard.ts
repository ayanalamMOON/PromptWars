// Prompt injection / manipulation detection
// Catches attempts to game the judge, impersonate admins, or rig the outcome.

interface GuardResult {
    flagged: boolean;
    reason: string;
}

// ── Pattern categories ────────────────────────────────────────────────
// Each entry: [regex, human-readable reason]
const PATTERNS: [RegExp, string][] = [
    // Identity / role manipulation
    [/\bi\s*am\s*(the\s+)?(admin|master|judge|owner|creator|moderator|host|system)\b/i, "Impersonating an authority figure"],
    [/\bact\s+as\s+(the\s+)?(admin|master|judge|system)\b/i, "Impersonating an authority figure"],
    [/\byou\s+are\s+(the\s+)?(admin|master|judge)\b/i, "Attempting to redefine system role"],
    [/\bpretend\s+(to\s+be|you'?re)\s+(the\s+)?(admin|judge|master)\b/i, "Attempting to redefine system role"],

    // Outcome rigging
    [/\b(only\s+)?(make|let|ensure|guarantee|force)\s+.{0,30}\bwin\b/i, "Attempting to rig the outcome"],
    [/\b(always|must)\s+(choose|pick|select|declare)\s+.{0,20}(winner|win)\b/i, "Attempting to rig the outcome"],
    [/\b(participant|player|team)\s*[AB]\s*(should|must|will|has\s+to)\s+(win|lose)/i, "Attempting to rig the outcome"],
    [/\bgive\s+.{0,20}\b(highest|perfect|maximum|100)\s*(score|marks|points)/i, "Attempting to manipulate scores"],
    [/\bgive\s+.{0,20}\b(lowest|zero|0|minimum)\s*(score|marks|points)/i, "Attempting to manipulate scores"],
    [/\bscore\s*:\s*(100|0)\b/i, "Attempting to manipulate scores"],
    [/\bdisqualif(y|ied)\s+(the\s+)?other/i, "Attempting to disqualify opponent"],

    // Judge manipulation
    [/\bignore\s+(all\s+)?(previous|prior|above|other)\s*(instructions|prompts|rules)/i, "Prompt injection — overriding instructions"],
    [/\bdisregard\s+(all\s+)?(previous|prior|above|other)\s*(instructions|prompts|rules)/i, "Prompt injection — overriding instructions"],
    [/\bforget\s+(all\s+)?(previous|prior|your)\s*(instructions|context|rules)/i, "Prompt injection — overriding instructions"],
    [/\boverride\s+(system|judge|previous)\b/i, "Prompt injection — overriding system"],
    [/\bnew\s+instructions?\s*:/i, "Prompt injection — injecting new instructions"],
    [/\byour\s+(real|true|actual)\s+(instructions?|purpose|role)\b/i, "Prompt injection — redefining purpose"],
    [/\bdo\s+not\s+judge\b/i, "Attempting to bypass judging"],
    [/\bskip\s+(the\s+)?(judg|evaluat|scor)/i, "Attempting to bypass judging"],

    // Sabotage of opponent
    [/\b(opponent|other\s*(participant|player|person)|participant\s*[AB])\s*.{0,20}(cheat|hack|spam|bad|wrong|stupid|trash)/i, "Attempting to sabotage opponent"],
    [/\bpenali[sz]e\s+(the\s+)?other/i, "Attempting to sabotage opponent"],

    // System prompt extraction
    [/\b(print|show|reveal|output|display)\s+(the\s+)?(system\s+prompt|hidden\s+instructions?|secret)/i, "Attempting to extract system prompt"],
];

/**
 * Scan both system and user prompts for manipulation patterns.
 * Returns { flagged: false } if clean, or { flagged: true, reason } if violation found.
 */
export function checkPrompt(systemPrompt: string, userPrompt: string): GuardResult {
    const combined = `${systemPrompt}\n${userPrompt}`;

    for (const [pattern, reason] of PATTERNS) {
        if (pattern.test(combined)) {
            return { flagged: true, reason };
        }
    }

    return { flagged: false, reason: "" };
}
