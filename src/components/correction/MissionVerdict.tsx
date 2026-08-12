import { Check, Minus } from "lucide-react";
import type { Entry, Lang } from "@/lib/types";
import { categoryLabel } from "@/lib/categories";
import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";

interface Props {
  mission: NonNullable<Entry["mission"]>;
  lang: Lang;
}

/** Sits at the top of the correction result when a mission was active for
 *  this entry. Judged client-side (see src/lib/missions.ts) — this
 *  component only renders the already-decided verdict. */
export function MissionVerdict({ mission, lang }: Props) {
  const { uiLang } = useUiLang();
  const label = categoryLabel(lang, mission.category, uiLang);

  return (
    <div className="mb-4 flex items-center gap-2 border-b border-dashed border-border pb-3">
      {mission.passed ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-[11px] font-bold text-success">
          <Check className="h-3 w-3" strokeWidth={3} />
          {t("missionPass", uiLang)}
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
          <Minus className="h-3 w-3" strokeWidth={3} />
          {t("missionFail", uiLang)}
        </span>
      )}
      <span className="text-xs text-muted-foreground">
        {(mission.passed
          ? t("missionPassCaption", uiLang)
          : t("missionFailCaption", uiLang)
        ).replaceAll("{cat}", label)}
      </span>
    </div>
  );
}
