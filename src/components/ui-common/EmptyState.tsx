import type { ReactNode } from "react";

interface Props {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/**
 * Editorial empty state used across History, Report, and empty search results.
 * Keeps the manuscript feel: uppercase kicker, serif headline, muted body,
 * optional action pill.
 */
export function EmptyState({ icon, title, description, action, className = "" }: Props) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-primary/15 bg-transparent px-6 py-16 text-center animate-reveal ${className}`}
    >
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/5 text-primary/60">
          {icon}
        </div>
      )}
      <div className="space-y-1.5">
        <h3 className="font-serif text-xl font-medium text-foreground">{title}</h3>
        {description && (
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
