interface Option<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  size?: "xs" | "sm" | "md";
  ariaLabel?: string;
}

const SIZE_STYLES = {
  xs: { text: "text-xs", pad: "px-2.5 py-1" },
  sm: { text: "text-xs", pad: "px-3 py-1.5" },
  md: { text: "text-sm", pad: "px-3 py-1.5" },
} as const;

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = "sm",
  ariaLabel,
}: Props<T>) {
  const s = SIZE_STYLES[size];
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`flex overflow-hidden rounded-md border border-border ${s.text}`}
    >
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={`${s.pad} transition-colors ${
              active ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
