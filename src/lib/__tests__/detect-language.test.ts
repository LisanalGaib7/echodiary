/**
 * Corpus for the deterministic language detector. Every real misclassification
 * we find belongs here as a case — that is the whole point of computing the
 * language instead of asking the model, which could not be regression-tested
 * without spending a live AI call per run.
 *
 * Run with: bun test
 */
// @ts-expect-error - bun:test is provided by the Bun runtime
import { expect, test } from "bun:test";
import { detectLanguage, hangulShare } from "../detect-language";

const cases: { name: string; want: "en" | "ko"; text: string }[] = [
  {
    name: "plain English",
    want: "en",
    text: "I woke up at six and went to the office. The meeting was long but productive.",
  },
  {
    name: "plain Korean",
    want: "ko",
    text: "오늘도 어김없이 아침 여섯시에 일어났다. 회의가 길었지만 그래도 생산적이었다.",
  },
  {
    // The reported bug: an English entry opening with a Korean phrase and
    // reaching for a Korean word mid-sentence was rewritten entirely in Korean.
    name: "English entry with a Korean opener and one Korean word",
    want: "en",
    text: "오늘도 어김없이 I went to a Starbucks shift. and I don't know what's wrong but my legs feel too heavy when doing ballet.... It feels like it's 권태기 of ballet.... so I'm planning to take some break from ballet. I will go ballet once a week while I used to go twice a week.",
  },
  {
    // Fails on a plain character count (19 Latin vs 15 Hangul reads as English)
    // even though every piece of grammar in it is Korean.
    name: "Korean sentence carrying English nouns",
    want: "ko",
    text: "오늘 Starbucks에서 alba를 했다. 그리고 ballet 수업도 갔다.",
  },
  {
    name: "English entry with a single Korean word",
    want: "en",
    text: "The cafe was crowded so I sat outside. I ordered an 아메리카노 and read for an hour before heading home.",
  },
  {
    name: "Korean entry with a single English word",
    want: "ko",
    text: "카페가 너무 붐벼서 밖에 앉았다. 아메리카노 한 잔 시켜놓고 한 시간쯤 책을 읽다가 집으로 왔다. 오늘은 review 하나를 겨우 끝냈다.",
  },
  {
    name: "empty string falls back to English",
    want: "en",
    text: "",
  },
  {
    name: "digits and punctuation only fall back to English",
    want: "en",
    text: "2026-08-21 :) !!! 100%",
  },
];

for (const c of cases) {
  test(`detectLanguage: ${c.name}`, () => {
    expect(detectLanguage(c.text)).toBe(c.want);
  });
}

test("mixed-but-mostly-English entries sit well below the threshold", () => {
  const share = hangulShare(
    "오늘도 어김없이 I went to a Starbucks shift. and I don't know what's wrong but my legs feel too heavy when doing ballet.... It feels like it's 권태기 of ballet....",
  );
  expect(share).toBeLessThan(0.3);
});

test("Korean carrying English nouns sits well above the threshold", () => {
  const share = hangulShare("오늘 Starbucks에서 alba를 했다. 그리고 ballet 수업도 갔다.");
  expect(share).toBeGreaterThan(0.5);
});
