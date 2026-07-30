import type { CorrectionResult, Lang } from "@/lib/types";
import type { ScoreTrend } from "@/lib/insights";
import { RefinedSection } from "./correction/RefinedSection";
import { ChangesTable } from "./correction/ChangesTable";
import { OverallSection } from "./correction/OverallSection";

interface Props {
  result: CorrectionResult;
  lang: Lang;
  /** Only available on the Write page, where recent entries are already on hand. */
  trend?: ScoreTrend;
  weeklyCounts?: Record<string, number>;
  /** Identifies the saved entry so a selected phrase in RefinedSection can be
   *  saved with a back-reference. Omitted while a correction is in flight. */
  entryId?: string;
  entryDate?: string;
}

export function CorrectionView({ result, lang, trend, weeklyCounts, entryId, entryDate }: Props) {
  return (
    <div className="space-y-6">
      <RefinedSection
        text={result.refinedText}
        entryId={entryId}
        entryDate={entryDate}
        language={lang}
      />
      <ChangesTable changes={result.changes} lang={lang} weeklyCounts={weeklyCounts} />
      <OverallSection overall={result.overall} trend={trend} />
    </div>
  );
}
