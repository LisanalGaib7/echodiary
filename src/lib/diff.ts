// Word-level diff so a changed sentence only highlights what actually moved,
// instead of re-printing the whole sentence twice with a blanket color.

export type DiffSeg = { type: "same" | "del" | "ins"; text: string };

function tokenize(s: string): string[] {
  return s.match(/\S+|\s+/g) ?? [];
}

export function wordDiff(original: string, refined: string): DiffSeg[] {
  const a = tokenize(original);
  const b = tokenize(refined);
  const n = a.length;
  const m = b.length;

  // LCS table, computed backwards so we can walk forward while reconstructing.
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const segs: DiffSeg[] = [];
  const push = (type: DiffSeg["type"], text: string) => {
    const last = segs[segs.length - 1];
    if (last && last.type === type) last.text += text;
    else segs.push({ type, text });
  };

  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      push("same", a[i]);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      push("del", a[i]);
      i++;
    } else {
      push("ins", b[j]);
      j++;
    }
  }
  while (i < n) push("del", a[i++]);
  while (j < m) push("ins", b[j++]);

  return coalesce(segs);
}

// The raw LCS diff fragments on every shared word, so "depending on my X every
// time" -> "every time my Y" comes out as four separate del/ins pairs instead
// of one edit. Merge same-spans of <= `gapWords` words into the edit around
// them — short enough that it's clearly one continuous rewrite, not two
// unrelated changes that happen to sit near each other.
function coalesce(segs: DiffSeg[], gapWords = 1): DiffSeg[] {
  const out: DiffSeg[] = [];
  let i = 0;
  while (i < segs.length) {
    if (segs[i].type === "same") {
      out.push(segs[i]);
      i++;
      continue;
    }
    let del = "";
    let ins = "";
    let j = i;
    while (j < segs.length) {
      const seg = segs[j];
      if (seg.type === "del") {
        del += seg.text;
        j++;
        continue;
      }
      if (seg.type === "ins") {
        ins += seg.text;
        j++;
        continue;
      }
      // seg.type === "same": bridge it only if it's a short gap with another
      // edit still ahead — otherwise this is just the plain text after the edit.
      const wordCount = seg.text.trim() ? seg.text.trim().split(/\s+/).length : 0;
      const hasMoreEditsAhead = segs.slice(j + 1).some((s) => s.type !== "same");
      if (wordCount <= gapWords && hasMoreEditsAhead) {
        del += seg.text;
        ins += seg.text;
        j++;
        continue;
      }
      break;
    }
    if (del) out.push({ type: "del", text: del });
    if (ins) out.push({ type: "ins", text: ins });
    i = j;
  }
  return out;
}
