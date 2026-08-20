// Single AI service module. UI calls correctEntry() only — implementation is hidden.
// To swap providers (e.g., Vercel + OpenAI), change ONLY this file.

import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { generateText } from "ai";
import { z } from "zod";
import { getAiModel } from "./ai-provider.server";
import { assertAllowedOrigin } from "./security/origin.server";
import { verifyTurnstile } from "./security/turnstile.server";
import { categoryCodes } from "./categories";
import type { CorrectionResult } from "./types";

const InputSchema = z.object({
  text: z.string().min(1).max(8000),
  captchaToken: z.string().optional(),
  explainLang: z.enum(["en", "ko"]).optional(),
});

const enCodes = categoryCodes("en").join(", ");
const koCodes = categoryCodes("ko").join(", ");

const EXPLAIN_LANG_NAME: Record<"en" | "ko", string> = { en: "English", ko: "Korean" };

function buildSystemPrompt(explainLang?: "en" | "ko"): string {
  // Default (no explainLang): explanatory text matches the diary's own
  // language, same as before this setting existed.
  const explainRule = explainLang
    ? `"reason", "strengths", and "improvements" must be written in ${EXPLAIN_LANG_NAME[explainLang]}, regardless of the diary's language. Any quoted snippet inside them still stays in the diary's own language — translate the surrounding explanation, never the quote.`
    : `"reason", "strengths", and "improvements" must be written in the SAME language as the diary.`;

  return `You are a strict but kind native-language diary editor.

TASK:
1. Detect the language of the user's diary entry. It is either English ("en") or Korean ("ko"). Never translate to another language.
2. Produce a refined version that reads as a native speaker would write it — natural, idiomatic, fluent. Preserve the writer's voice and meaning. "refinedText" and every "original"/"refined" snippet in "changes" always stay in the diary's own language.
3. List every meaningful change as its own row: original snippet → refined snippet → reason → category code. One distinct edit per row — if two separate corrections happen to sit in the same sentence (e.g. a wrong abbreviation AND a wrong article nearby), give them separate rows with separate reasons rather than explaining both in one reason. Only combine snippets into a single row when they are the exact same correction repeated verbatim.
4. Score the ORIGINAL text on a native-speaker scale of 0–10 (10 = fully native-quality), and give sub-scores for accuracy, naturalness, vocabulary, structure. Include short "strengths" and "improvements" notes.

CATEGORY CODES (pick ONLY from the set for the detected language):
- English (en): ${enCodes}
- Korean (ko): ${koCodes}

OUTPUT RULES:
- Return ONLY valid JSON. No prose, no markdown, no code fences.
- If no changes are needed, return "changes": [] and "refinedText" equal to the original input.
- ${explainRule}
- "reason" is ONE short sentence naming the linguistic issue directly — no hedging ("assuming...", "it seems...", "possibly..."), no restating the original/refined snippets (those already appear separately in the row), no filler lead-ins.

VOICE FOR "strengths" AND "improvements":
Write like a native-speaking writing coach giving personal, editorial feedback — not a generic AI summary.
- ALWAYS quote or reference at least one specific phrase from the user's original text (use quotation marks around the quoted snippet, in the diary's language, even when the surrounding sentence is in a different language).
- Explain the linguistic reason behind the observation (e.g. why a particular article is wrong, what a word choice signals to a native reader, what register a phrase carries).
- "strengths": name exactly what the writer did well and why it works in native usage — tie it to a specific phrase they wrote.
- "improvements": point to a specific pattern or recurring tendency you observed in THIS entry, not a vague suggestion. Reference the concrete phrase that exemplifies it.
- Length: 2–4 sentences each. Dense and useful, never padded.
- Tone: direct, coach-like, warm but not effusive.
- FORBIDDEN phrases (do not use, in any language): "Overall", "Great job", "Well done", "It is worth noting", "Furthermore", "In conclusion", "You did a great job", "Keep it up", or any sentence starting with "Your writing".

JSON SHAPE (exact keys):
{
  "language": "en" | "ko",
  "refinedText": string,
  "changes": [{ "original": string, "refined": string, "reason": string, "category": string }],
  "overall": {
    "score": number,
    "subScores": { "accuracy": number, "naturalness": number, "vocabulary": number, "structure": number },
    "strengths": string,
    "improvements": string
  }
}`;
}

const ResultSchema = z.object({
  language: z.enum(["en", "ko"]),
  refinedText: z.string(),
  changes: z.array(
    z.object({
      original: z.string(),
      refined: z.string(),
      reason: z.string(),
      category: z.string(),
    }),
  ),
  overall: z.object({
    score: z.number(),
    subScores: z.object({
      accuracy: z.number(),
      naturalness: z.number(),
      vocabulary: z.number(),
      structure: z.number(),
    }),
    strengths: z.string(),
    improvements: z.string(),
  }),
});

function stripFences(s: string): string {
  return s
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

// Lightweight in-memory per-IP rate limiter to mitigate abuse of the
// unauthenticated AI endpoint. Limits each IP to RATE_LIMIT_MAX requests
// per RATE_LIMIT_WINDOW_MS. State is per worker isolate (best-effort).
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: Request): string {
  const fwd =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return fwd || "unknown";
}

function checkRateLimit(ip: string): void {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(ip);
  if (!bucket || bucket.resetAt < now) {
    rateLimitBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return;
  }
  if (bucket.count >= RATE_LIMIT_MAX) {
    throw new Response("Too Many Requests", { status: 429 });
  }
  bucket.count += 1;
}

export const correctEntry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<CorrectionResult> => {
    const req = getRequest();
    if (req) {
      assertAllowedOrigin(req);
      await verifyTurnstile(data.captchaToken, req);
      checkRateLimit(getClientIp(req));
    }

    const model = getAiModel();
    const { text } = await generateText({
      model,
      system: buildSystemPrompt(data.explainLang),
      prompt: data.text,
    });

    let parsed: unknown;
    try {
      parsed = JSON.parse(stripFences(text));
    } catch {
      // Try to extract first {...} block
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("AI did not return JSON");
      parsed = JSON.parse(match[0]);
    }

    const result = ResultSchema.parse(parsed);

    // Validate category codes against the detected language set
    const allowed = categoryCodes(result.language);
    const fallback = result.language === "en" ? "word_choice" : "naturalness";
    result.changes = result.changes.map((c) => ({
      ...c,
      category: allowed.includes(c.category) ? c.category : fallback,
    }));

    return result;
  });
