import type { CorrectionResult, Lang } from "@/lib/types";
import { RefinedSection } from "./correction/RefinedSection";
import { ChangesTable } from "./correction/ChangesTable";
import { OverallSection } from "./correction/OverallSection";

export function CorrectionView({ result, lang }: { result: CorrectionResult; lang: Lang }) {
  return (
    <div className="space-y-6">
      <RefinedSection text={result.refinedText} />
      <ChangesTable changes={result.changes} lang={lang} />
      <OverallSection overall={result.overall} />
    </div>
  );
}
