import { useCallback, useRef, useState } from "react";
import { Download, Upload, FileText } from "lucide-react";
import {
  applyBackup,
  backupFilename,
  buildBackup,
  downloadFile,
  parseBackup,
  toMarkdown,
  type RestoreResult,
} from "@/lib/backup";
import { getAllEntries } from "@/lib/db";
import { useEntries } from "@/hooks/useEntries";
import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";
import { Spinner } from "@/components/ui-common/Spinner";

type Status = "idle" | "working" | "error";

const buttonBase =
  "inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-primary transition-colors hover:bg-primary/10 disabled:opacity-45";

export function DataSection() {
  const { uiLang } = useUiLang();
  const { entries } = useEntries();
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<RestoreResult | null>(null);

  // `entries` is null while the shared loader is still reading IndexedDB —
  // treat that as "not exportable yet" without claiming the diary is empty.
  const loaded = entries !== null;
  const isEmpty = loaded && entries.length === 0;

  const handleExportJson = useCallback(async () => {
    setStatus("working");
    setResult(null);
    try {
      const backup = await buildBackup();
      downloadFile(backupFilename("json"), JSON.stringify(backup, null, 2), "application/json");
      setStatus("idle");
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  }, []);

  const handleExportMarkdown = useCallback(async () => {
    setStatus("working");
    setResult(null);
    try {
      const all = await getAllEntries();
      downloadFile(backupFilename("md"), toMarkdown(all), "text/markdown");
      setStatus("idle");
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  }, []);

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset immediately so picking the same file twice still fires onChange.
    e.target.value = "";
    if (!file) return;

    setStatus("working");
    setResult(null);
    try {
      const text = await file.text();
      // Validates the whole file before a single write, so a malformed
      // backup can never leave the database half-restored.
      const parsed = parseBackup(text);
      setResult(await applyBackup(parsed));
      setStatus("idle");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleExportJson}
          disabled={!loaded || isEmpty || status === "working"}
          className={buttonBase}
        >
          {status === "working" ? <Spinner size={12} /> : <Download className="h-3.5 w-3.5" />}
          {t("exportJson", uiLang)}
        </button>

        <button
          type="button"
          onClick={handleExportMarkdown}
          disabled={!loaded || isEmpty || status === "working"}
          className={buttonBase}
        >
          <FileText className="h-3.5 w-3.5" />
          {t("exportMarkdown", uiLang)}
        </button>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={status === "working"}
          className={buttonBase}
        >
          <Upload className="h-3.5 w-3.5" />
          {t("importBackup", uiLang)}
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          onChange={handleFile}
          className="hidden"
        />
      </div>

      {isEmpty && <p className="text-xs text-muted-foreground">{t("dataEmpty", uiLang)}</p>}

      {status === "error" && (
        <p className="text-xs text-destructive">{t("importFailed", uiLang)}</p>
      )}

      {result && status === "idle" && (
        <p className="text-xs text-muted-foreground">
          {result.entriesAdded}
          {t("importAdded", uiLang)}
          {result.entriesSkipped > 0 && (
            <>
              {" · "}
              {result.entriesSkipped}
              {t("importSkipped", uiLang)}
            </>
          )}
        </p>
      )}
    </div>
  );
}
