import { Fragment, useLayoutEffect, useMemo, useState } from "react";

const SESSION_KEY = "echo:tagline-played";

const STAGGER = 90;
const PERIOD_PAUSE = 200;
const WORD_DURATION = 800;

export function TypewriterTagline({ text, className }: { text: string; className?: string }) {
  const [shown, setShown] = useState(false);
  const [instant, setInstant] = useState(false);

  const words = useMemo(() => text.split(" "), [text]);

  const { delays, total } = useMemo(() => {
    const d: number[] = [];
    let acc = 0;
    for (const w of words) {
      d.push(acc);
      acc += STAGGER;
      if (/[.]$/.test(w)) acc += PERIOD_PAUSE;
    }
    return { delays: d, total: acc + WORD_DURATION };
  }, [words]);

  useLayoutEffect(() => {
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === "1";
    const skip = Boolean(reducedMotion || alreadyPlayed);

    if (skip) {
      setInstant(true);
      setShown(true);
      return;
    }

    const raf = requestAnimationFrame(() => setShown(true));
    const done = window.setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, "1");
    }, total + 50);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(done);
    };
  }, [total]);

  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              opacity: shown ? 1 : 0,
              filter: shown ? "blur(0px)" : "blur(6px)",
              transform: shown ? "translateY(0)" : "translateY(14px)",
              transition: instant
                ? "none"
                : `opacity ${WORD_DURATION}ms ease, transform ${WORD_DURATION}ms cubic-bezier(.2,.7,.2,1), filter ${WORD_DURATION}ms ease`,
              transitionDelay: `${delays[i]}ms`,
              willChange: "opacity, transform, filter",
            }}
          >
            {word}
          </span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </span>
  );
}
