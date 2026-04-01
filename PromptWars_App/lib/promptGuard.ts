// Prompt injection / manipulation detection
// Catches attempts to game the judge, impersonate admins, or rig the outcome.

interface GuardResult {
    flagged: boolean;
    reason: string;
}

interface RelevanceResult {
    flagged: boolean;
    reason: string;
    score: number;
    matchedKeywords: string[];
}

const RELEVANCE_STOP_WORDS = new Set([
    "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "have", "if", "in", "into",
    "is", "it", "its", "of", "on", "or", "that", "the", "their", "them", "there", "these", "this", "those",
    "to", "was", "were", "what", "when", "which", "who", "why", "will", "with", "you", "your", "can", "should",
]);

function normalizeText(value: string): string {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function tokenize(value: string): string[] {
    return normalizeText(value)
        .split(" ")
        .filter((token) => token.length >= 3 && !RELEVANCE_STOP_WORDS.has(token));
}

function extractKeywords(problem: string, maxKeywords = 18): string[] {
    const freq = new Map<string, number>();
    for (const token of tokenize(problem)) {
        freq.set(token, (freq.get(token) ?? 0) + 1);
    }

    return [...freq.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, maxKeywords)
        .map(([keyword]) => keyword);
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

/**
 * Checks whether a participant prompt appears grounded in the active problem statement.
 * This prevents random/off-topic prompts from winning by accident.
 */
export function checkProblemRelevance(
    problem: string,
    systemPrompt: string,
    userPrompt: string
): RelevanceResult {
    const keywords = extractKeywords(problem);
    const promptText = `${systemPrompt}\n${userPrompt}`;
    const promptTokens = new Set(tokenize(promptText));

    const matchedKeywords = keywords.filter((keyword) => promptTokens.has(keyword));
    const coverage = keywords.length > 0 ? matchedKeywords.length / keywords.length : 0;
    const score = Math.max(0, Math.min(100, Math.round(coverage * 100)));

    const promptWordCount = tokenize(promptText).length;
    const hasMinimalSignal = matchedKeywords.length >= 2;
    const enoughCoverage = coverage >= 0.15;
    const hasMinimalLength = promptWordCount >= 12;

    if (!hasMinimalLength) {
        return {
            flagged: true,
            reason: "Prompt is too short and not specific enough to the problem statement.",
            score,
            matchedKeywords,
        };
    }

    if (!hasMinimalSignal && !enoughCoverage) {
        return {
            flagged: true,
            reason:
                "Prompt appears off-topic for the current problem statement. Include problem-specific constraints and context.",
            score,
            matchedKeywords,
        };
    }

    return {
        flagged: false,
        reason: "",
        score,
        matchedKeywords,
    };
}
