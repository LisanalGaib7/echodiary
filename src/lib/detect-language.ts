// Which language an entry is written in — computed here, not asked of the AI.
//
// Letting the model detect this produced a destructive failure on code-switched
// entries: an English diary with a couple of Korean words dropped in ("It feels
// like it's 권태기 of ballet") was detected as Korean, and the model then
// rewrote the whole entry in Korean — losing the user's English writing
// entirely. Language is a computable property of the string, so it is computed
// and handed to the model rather than inferred by it.

import type { Lang } from "./types";

/** Latin characters per Hangul syllable at equal meaning. Measured on
 *  translation pairs (2.08 / 2.33 / 2.54 — mean 2.32): "ballet" is six
 *  characters where "발레" is two syllables. Without this correction a plain
 *  character count is biased toward English, and a Korean sentence carrying a
 *  few English nouns ("오늘 Starbucks에서 alba를 했다") counts as English. */
const HANGUL_WEIGHT = 2.3;

/** Above this weighted share of Hangul, the entry is Korean. Measured cases
 *  cluster far from the boundary — English tops out around 0.15 and Korean
 *  bottoms out around 0.66 — so anywhere in that gap gives the same answer. */
const KO_THRESHOLD = 0.4;

const HANGUL_SYLLABLES = /[가-힣]/g;
const LATIN_LETTERS = /[A-Za-z]/g;

/** Weighted share of the entry that is Hangul, 0 (all Latin) to 1 (all
 *  Hangul). Exported for the tests and for anything that wants to know how
 *  clear-cut a given entry is. */
export function hangulShare(text: string): number {
  const hangul = (text.match(HANGUL_SYLLABLES) ?? []).length * HANGUL_WEIGHT;
  const latin = (text.match(LATIN_LETTERS) ?? []).length;
  if (hangul + latin === 0) return 0;
  return hangul / (hangul + latin);
}

/** Defaults to English for text with no letters at all (digits, punctuation,
 *  emoji) — arbitrary, but such an entry has nothing to correct either way. */
export function detectLanguage(text: string): Lang {
  return hangulShare(text) >= KO_THRESHOLD ? "ko" : "en";
}
