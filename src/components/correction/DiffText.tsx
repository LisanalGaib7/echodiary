import { wordDiff } from "@/lib/diff";

/** Renders only the words that changed between original and refined — the rest reads as plain prose. */
export function DiffText({ original, refined }: { original: string; refined: string }) {
  const segs = wordDiff(original, refined);
  return (
    <p className="whitespace-pre-wrap font-serif text-[1.02rem] leading-relaxed text-ink">
      {segs.map((seg, i) => {
        if (seg.type === "same") return <span key={i}>{seg.text}</span>;
        if (seg.type === "del")
          return (
            <del key={i} className="text-muted-foreground/70 decoration-muted-foreground/60">
              {seg.text}
            </del>
          );
        return (
          <ins key={i} className="rounded-[3px] bg-primary/10 px-0.5 text-primary no-underline">
            {seg.text}
          </ins>
        );
      })}
    </p>
  );
}
