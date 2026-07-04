import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { CorrectionView } from "@/components/CorrectionView";
import { DiaryEditor } from "@/components/DiaryEditor";
import { TypewriterTagline } from "@/components/TypewriterTagline";
import { WeeklyGoal } from "@/components/WeeklyGoal";
import { useCorrection } from "@/hooks/useCorrection";
import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Echo — Write & correct" },
      {
        name: "description",
        content: "Write a diary entry in English or Korean and get a native-level correction.",
      },
    ],
  }),
  component: WritePage,
});

function WritePage() {
  const { uiLang } = useUiLang();
  const { loading, result, submit } = useCorrection();

  return (
    <div className="space-y-8">
      <Toaster position="top-center" />

      <h1 className="font-display text-4xl font-medium leading-[1.08] tracking-[-0.02em] sm:text-5xl">
        <TypewriterTagline text={t("tagline", uiLang)} />
      </h1>

      <WeeklyGoal />

      <DiaryEditor loading={loading} onSubmit={submit} />

      {result && <CorrectionView result={result} lang={result.language} />}
    </div>
  );
}
