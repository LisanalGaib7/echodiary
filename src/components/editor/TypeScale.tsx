import { useEffect, useRef, useState } from "react";
import { TYPE_STEPS, useEditorType } from "@/lib/editor-type";

/** aria-labels for each step. Not run through i18n: the control is five
 *  serif "A"s, not copy — screen readers just need the point size named. */
const STEP_LABELS = TYPE_STEPS.map((s) => `${s.fontSize}px`);

/**
 * Always-on five-step type scale for the diary editor, set on a shared
 * type baseline (the A's grow upward together, like a specimen sheet)
 * with a sliding 2px rule marking the active step.
 *
 * On narrow viewports the same control relocates into a compact "Aa"
 * popover so it doesn't compete with the date/draft-status row.
 */
export function TypeScale() {
  const { typeStep, setTypeStep } = useEditorType();
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const groupRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const apply = () => setCompact(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Slide the baseline rule under the active step. Runs after every
  // render so it also re-measures when the control relocates (compact
  // <-> inline) or the window resizes, since the two placements set
  // different button font sizes.
  useEffect(() => {
    const btn = groupRef.current?.querySelector<HTMLButtonElement>(`[data-i="${typeStep}"]`);
    const rule = ruleRef.current;
    if (!btn || !rule) return;
    rule.style.setProperty("--x", `${btn.offsetLeft}px`);
    rule.style.setProperty("--w", `${btn.offsetWidth}px`);
  });

  useEffect(() => {
    if (!compact) setOpen(false);
  }, [compact]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        anchorRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function move(next: number) {
    const clamped = Math.max(0, Math.min(TYPE_STEPS.length - 1, next));
    setTypeStep(clamped);
    groupRef.current?.querySelector<HTMLButtonElement>(`[data-i="${clamped}"]`)?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      move(typeStep + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      move(typeStep - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      move(0);
    } else if (e.key === "End") {
      e.preventDefault();
      move(TYPE_STEPS.length - 1);
    }
  }

  const group = (
    <div
      ref={groupRef}
      role="radiogroup"
      aria-label="본문 크기"
      onKeyDown={onKeyDown}
      className="relative flex items-baseline gap-0.5 pb-1.5"
    >
      <span
        ref={ruleRef}
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-0.5 rounded-full bg-primary transition-[transform,width] duration-300 [transition-timing-function:var(--ease-spring)]"
        style={{ width: "var(--w, 24px)", transform: "translateX(var(--x, 0px))" }}
      />
      {TYPE_STEPS.map((step, i) => (
        <button
          key={i}
          type="button"
          role="radio"
          aria-checked={i === typeStep}
          aria-label={STEP_LABELS[i]}
          data-i={i}
          tabIndex={i === typeStep ? 0 : -1}
          onClick={() => setTypeStep(i)}
          className="rounded-md px-2 py-1 font-serif leading-none text-muted-foreground/75 transition-colors hover:bg-primary/[0.07] hover:text-ink data-[checked=true]:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          data-checked={i === typeStep}
          style={{ fontSize: 11 + i * 2.75 }}
        >
          A
        </button>
      ))}
    </div>
  );

  if (!compact) return group;

  return (
    <span ref={wrapRef} className="relative inline-flex">
      <button
        ref={anchorRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="본문 크기"
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg px-2 py-1.5 font-serif text-[15px] leading-none text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        A<span className="text-[1.24em]">a</span>
      </button>
      {open && (
        <span
          role="dialog"
          aria-label="본문 크기"
          className="absolute right-0 top-[calc(100%+10px)] z-30 origin-top-right rounded-2xl border border-border bg-card px-3 py-2 shadow-xl"
        >
          {group}
        </span>
      )}
    </span>
  );
}
