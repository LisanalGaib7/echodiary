import { useEffect, useState } from "react";

const SESSION_KEY = "echo:tagline-played";
const TOTAL_MS = 2000;

export function TypewriterTagline({ text, className }: { text: string; className?: string }) {
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const alreadyPlayed =
    typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "1";
  const skip = reducedMotion || alreadyPlayed;

  const [count, setCount] = useState(skip ? text.length : 0);
  const [phase, setPhase] = useState<"typing" | "blinking" | "done">(
    skip ? "done" : "typing",
  );

  useEffect(() => {
    if (skip) return;
    const perChar = TOTAL_MS / text.length;
    let i = 0;
    const typer = window.setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) {
        window.clearInterval(typer);
        setPhase("blinking");
        // ~3.5 blinks at 500ms cycle = ~1750ms
        window.setTimeout(() => {
          setPhase("done");
          sessionStorage.setItem(SESSION_KEY, "1");
        }, 1750);
      }
    }, perChar);
    return () => window.clearInterval(typer);
  }, [text, skip]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden={phase !== "done"}>{text.slice(0, count)}</span>
      {phase !== "done" && (
        <span
          className="ml-0.5 inline-block w-[1px] animate-caret-blink bg-current align-baseline"
          style={{ height: "0.9em" }}
          aria-hidden="true"
        />
      )}
    </span>
  );
}
