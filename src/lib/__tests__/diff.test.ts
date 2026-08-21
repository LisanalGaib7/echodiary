/**
 * wordDiff is computed from originalText/refinedText, not from the AI's
 * self-reported `changes` rows. That distinction is the whole point: three
 * production reproductions (below) each showed the AI's own account of what
 * it changed was wrong in a different way — a whole substitution silently
 * missing from `changes`, a row whose "original" span didn't cover the full
 * edit, a translated word kept only inside scare quotes. wordDiff can't
 * reproduce any of those failure modes, because it isn't told what changed —
 * it computes it from the two full strings every time.
 *
 * Run with: bun test
 */
// @ts-expect-error - bun:test is provided by the Bun runtime
import { expect, test } from "bun:test";
import { wordDiff } from "../diff";

/** What RefinedSection actually renders: "del" is dropped (words that only
 *  existed in the original never appear in a paragraph showing refinedText),
 *  and the rest reconstructs refinedText exactly. */
function insSpans(original: string, refined: string): string[] {
  return wordDiff(original, refined)
    .filter((s) => s.type === "ins")
    .map((s) => s.text.trim())
    .filter(Boolean);
}

function reconstructsRefined(original: string, refined: string): boolean {
  const kept = wordDiff(original, refined)
    .filter((s) => s.type !== "del")
    .map((s) => s.text)
    .join("");
  return kept === refined;
}

test("case 1: a substitution the AI's own changes[] omitted entirely still highlights", () => {
  // Production: "오늘도 어김없이 I went to a Starbucks shift..." → the model
  // translated the opener to "Today, as usual, I went to a Starbucks shift."
  // with zero rows in `changes` covering it. wordDiff doesn't need a row.
  const original = "오늘도 어김없이 I went to a Starbucks shift.";
  const refined = "Today, as usual, I went to a Starbucks shift.";
  const spans = insSpans(original, refined);
  expect(spans.join(" ")).toContain("Today,");
  expect(spans.join(" ")).toContain("as usual,");
});

test("case 2: a row whose original span didn't cover the full edit still highlights all of it", () => {
  // Production: changes[0].original was "어김없이 I go to work" — missing the
  // leading "오늘도" even though refinedText's "Today" covers it too.
  const original = "오늘도 어김없이 I go to work and had lunch with my coworker.";
  const refined = "Today, as always, I went to work and had lunch with my coworker.";
  const spans = insSpans(original, refined);
  // The whole opener is one continuous edit — "오늘도" isn't stranded outside it.
  expect(spans.some((s) => s.startsWith("Today,"))).toBe(true);
});

test("case 3: a word the AI kept in scare quotes instead of translating doesn't get invented or dropped", () => {
  // Production (pre-#24 prompt): 권태기 was kept verbatim, just wrapped in
  // quotes, rather than translated. The quote marks make '"권태기"' a
  // different token from '권태기', so wordDiff reports it as a real edit —
  // that's correct, since something about that word's presentation did
  // change. What matters is nothing is fabricated: every kept/inserted word
  // traces back to one of the two input strings.
  const original = "It feels like it's 권태기 of ballet.";
  const refined = 'It feels like I\'m experiencing a "권태기" with ballet.';
  expect(reconstructsRefined(original, refined)).toBe(true);
  expect(insSpans(original, refined).join(" ")).toContain("권태기");
});

test("filtering out del segments always reconstructs refinedText exactly", () => {
  const cases: [string, string][] = [
    ["I go to a Starbucks shift.", "I went to a Starbucks shift."],
    [
      "오늘도 어김없이 I went to a Starbucks shift.",
      "Today, as usual, I went to a Starbucks shift.",
    ],
    ["같은 문장입니다.", "같은 문장입니다."],
    ["", "Hello."],
    ["Hello.", ""],
  ];
  for (const [original, refined] of cases) {
    expect(reconstructsRefined(original, refined)).toBe(true);
  }
});

test("no changes at all produces no ins spans", () => {
  const text = "This entry needed no corrections at all.";
  expect(insSpans(text, text)).toEqual([]);
});
