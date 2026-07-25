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
}

export function CorrectionView({ result, lang, trend, weeklyCounts }: Props) {
  return (
    <div className="space-y-6">
      <RefinedSection text={result.refinedText} />
      <ChangesTable changes={result.changes} lang={lang} weeklyCounts={weeklyCounts} />
      <OverallSection overall={result.overall} trend={trend} />
    </div>
  );
}
