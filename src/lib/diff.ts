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

  return segs;
}
