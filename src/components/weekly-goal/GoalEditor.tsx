import { useEffect, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { useUiLang } from "@/lib/ui-lang";

interface Props {
  target: number;
  min: number;
  max: number;
  onSave: (n: number) => void;
}

export function GoalEditor({ target, min, max, onSave }: Props) {
  const { uiLang } = useUiLang();
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  function commit(value: number) {
    onSave(value);
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="number"
        min={min}
        max={max}
        defaultValue={target}
        onBlur={(e) => commit(Number(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit(Number((e.target as HTMLInputElement).value));
          if (e.key === "Escape") setEditing(false);
        }}
        className="w-[2.2em] border-b border-primary/40 bg-transparent pb-px text-center text-foreground outline-none transition-colors focus:border-primary"
        style={{ font: "inherit" }}
      />
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="group inline-flex items-baseline gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
      aria-label={uiLang === "ko" ? "목표 수정" : "Edit goal"}
    >
      <span className="border-b border-transparent pb-px transition-all group-hover:border-muted-foreground/40">
        {target}
      </span>
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted/60 transition-all group-hover:bg-muted">
        <Pencil
          className="h-2.5 w-2.5 opacity-40 transition-opacity group-hover:opacity-100"
          strokeWidth={2}
        />
      </span>
    </button>
  );
}
