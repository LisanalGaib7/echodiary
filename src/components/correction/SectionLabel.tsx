import type { ReactNode } from "react";

/** Shared header treatment for the four correction-view cards — same vocabulary as "Chapter I — Write". */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/60">
      {children}
    </p>
  );
}
