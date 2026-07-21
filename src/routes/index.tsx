import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { CorrectionView } from "@/components/CorrectionView";
import { DiaryEditor } from "@/components/DiaryEditor";
import { useCorrection } from "@/hooks/useCorrection";
import { useUiLang } from "@/lib/ui-lang";

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

  const headline =
    uiLang === "ko" ? (
      <>
        오늘의 <span className="italic font-light">문장</span>을 남기세요.
      </>
    ) : (
      <>
        Echo <span className="italic font-light">your</span> thoughts.
      </>
    );

  const kicker =
    uiLang === "ko" ? "제 I 장 — 쓰기" : "Chapter I — Write";

  return (
    <div className="space-y-16">
      <Toaster position="top-center" />

      <header className="reveal space-y-4" style={{ animationDelay: "40ms" }}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary/60">
          {kicker}
        </p>
        <h1 className="font-display text-6xl font-light leading-[0.92] tracking-[-0.03em] text-primary sm:text-7xl md:text-[6rem]">
          {headline}
        </h1>
      </header>

      <div className="reveal" style={{ animationDelay: "180ms" }}>
        <DiaryEditor loading={loading} onSubmit={submit} />
      </div>

      {result && (
        <div className="reveal">
          <CorrectionView result={result} lang={result.language} />
        </div>
      )}
    </div>
  );
}
