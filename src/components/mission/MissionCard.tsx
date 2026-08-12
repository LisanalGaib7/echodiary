import { Target, Flame } from "lucide-react";
import type { Entry } from "@/lib/types";
import type { Mission } from "@/lib/missions";
import { missionStreak, skipMissionToday } from "@/lib/missions";
import { categoryLabel } from "@/lib/categories";
import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";

interface Props {
  mission: Mission;
  entries: Entry[];
  /** Persists the skip (localStorage, see missions.ts) and tells the
   *  parent to stop rendering this card — the parent owns visibility so a
   *  page reload doesn't resurrect a mission skipped earlier today. */
  onSkip: () => void;
}

/** Sits above the editor on the Write page. Skippable — a mission is a
 *  suggestion, never a gate on writing (Product Spec §6-1). */
export function MissionCard({ mission, entries, onSkip }: Props) {
  const { uiLang } = useUiLang();

  const label = categoryLabel(mission.language, mission.category, uiLang);
  const streak = missionStreak(entries, mission.category);

  const text = t("missionText", uiLang).replaceAll("{cat}", label);
  const streakText = t("missionStreak", uiLang)
    .replaceAll("{cat}", label)
    .replaceAll("{n}", String(streak));

  return (
    <div className="mb-6 flex flex-col gap-2.5 rounded-xl border border-primary/25 bg-primary/[0.04] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
          <Target className="h-3 w-3" strokeWidth={2.5} />
          {t("missionEyebrow", uiLang)}
        </div>
        <button
          type="button"
          onClick={() => {
            skipMissionToday();
            onSkip();
          }}
          className="shrink-0 text-[11px] font-semibold text-muted-foreground underline decoration-dotted underline-offset-2 hover:text-foreground"
        >
          {t("missionSkip", uiLang)}
        </button>
      </div>

      <p className="text-sm leading-relaxed text-foreground">{text}</p>

      {streak > 0 && (
        <div className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
          <Flame className="h-3 w-3 text-primary/70" strokeWidth={2} />
          {streakText}
        </div>
      )}
    </div>
  );
}
