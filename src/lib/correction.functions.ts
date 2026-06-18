// Single AI service module. UI calls correctEntry() only — implementation is hidden.
// To swap providers (e.g., Vercel + OpenAI), change ONLY this file.

import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import { EN_CATEGORIES, KO_CATEGORIES } from "./categories";
import type { CorrectionResult } from "./types";

const InputSchema = z.object({ text: z.string().min(1).max(8000) });

const enCodes = EN_CATEGORIES.map((c) => c.code).join(", ");
const koCodes = KO_CATEGORIES.map((c) => c.code).join(", ");

const SYSTEM_PROMPT = `You are a strict but kind native-language diary editor.

TASK:
1. Detect the language of the user's diary entry. It is either English ("en") or Korean ("ko"). Never translate to another language.
2. Produce a refined version that reads as a native speaker would write it — natural, idiomatic, fluent. Preserve the writer's voice and meaning.
3. List every meaningful change as a row: original snippet → refined snippet → reason → category code.
4. Score the ORIGINAL text on a native-speaker scale of 0–10 (10 = fully native-quality), and give sub-scores for accuracy, naturalness, vocabulary, structure. Include short "strengths" and "improvements" notes.

CATEGORY CODES (pick ONLY from the set for the detected language):
- English (en): ${enCodes}
- Korean (ko): ${koCodes}

OUTPUT RULES:
- Return ONLY valid JSON. No prose, no markdown, no code fences.
- If no changes are needed, return "changes": [] and "refinedText" equal to the original input.
- "strengths" and "improvements" must be written in the SAME language as the diary.

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

const ResultSchema = z.object({
  language: z.enum(["en", "ko"]),
  refinedText: z.string(),
  changes: z.array(
    z.object({
      original: z.string(),
      refined: z.string(),
      reason: z.string(),
      category: z.string(),
    })
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

export const correctEntry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<CorrectionResult> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system: SYSTEM_PROMPT,
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
    const allowed = result.language === "en"
      ? EN_CATEGORIES.map((c) => c.code)
      : KO_CATEGORIES.map((c) => c.code);
    result.changes = result.changes.map((c) => ({
      ...c,
      category: allowed.includes(c.category)
        ? c.category
        : result.language === "en"
          ? "word_choice"
          : "naturalness",
    }));

    return result;
  });
