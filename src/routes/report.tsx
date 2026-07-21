import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BarChart3 } from "lucide-react";
import { getAllEntries } from "@/lib/db";
import { buildReport, filterByPeriod, type LangReport } from "@/lib/report";
import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";
import { SegmentedControl } from "@/components/ui-common/SegmentedControl";
import { LangReportCard } from "@/components/report/LangReportCard";
import { EmptyState } from "@/components/ui-common/EmptyState";
import { Spinner } from "@/components/ui-common/Spinner";

type Period = "all" | "30d";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Echo — Report" },
      { name: "description", content: "See which errors you make most often, per language." },
    ],
  }),
  component: ReportPage,
});

function ReportPage() {
  const { uiLang } = useUiLang();
  const [period, setPeriod] = useState<Period>("all");
  const [reports, setReports] = useState<{ en: LangReport; ko: LangReport } | null>(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const all = await getAllEntries();
      const filtered = filterByPeriod(all, period);
      setReports({ en: buildReport(filtered, "en"), ko: buildReport(filtered, "ko") });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-serif text-3xl font-semibold">{t("navReport", uiLang)}</h1>
        <div className="flex items-center gap-3">
          <SegmentedControl<Period>
            size="md"
            value={period}
            onChange={setPeriod}
            options={[
              { value: "all", label: t("allTime", uiLang) },
              { value: "30d", label: t("last30", uiLang) },
            ]}
          />
          <button
            onClick={generate}
            disabled={loading}
            aria-busy={loading}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {loading && <Spinner size={12} />}
            {loading ? t("correcting", uiLang) : t("generate", uiLang)}
          </button>
        </div>
      </div>

      {reports === null ? (
        <EmptyState
          icon={<BarChart3 className="h-5 w-5" />}
          title={t("emptyReportTitle", uiLang)}
          description={t("emptyReportDesc", uiLang)}
          action={
            <button
              onClick={generate}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.22em] text-primary-foreground shadow-lg shadow-primary/10 transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              {loading && <Spinner size={12} />}
              {t("generate", uiLang)}
            </button>
          }
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <LangReportCard r={reports.en} title={t("english", uiLang)} />
          <LangReportCard r={reports.ko} title={t("korean", uiLang)} />
        </div>
      )}
    </div>
  );
}
