import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Send, Check } from "lucide-react";
import { sendFeedback } from "@/lib/feedback.functions";
import { useUiLang } from "@/lib/ui-lang";
import { t } from "@/lib/i18n";
import { Spinner } from "@/components/ui-common/Spinner";

type Kind = "feedback" | "bug" | "question";
type Status = "idle" | "sending" | "sent" | "error";

const MAX_LEN = 1500;

interface Props {
  /** Called once the "sent" confirmation finishes — lets the FAB panel
   *  auto-close. Settings' embedded copy leaves this unset and just resets. */
  onSent?: () => void;
}

/** Shared body (kind picker, textarea, send control) reused by the FAB
 *  panel and the Settings page — only the surrounding header/chrome differs
 *  per caller. */
export function FeedbackForm({ onSent }: Props) {
  const { uiLang } = useUiLang();
  const send = useServerFn(sendFeedback);
  const [kind, setKind] = useState<Kind>("feedback");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const sentTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (sentTimer.current) clearTimeout(sentTimer.current);
    };
  }, []);

  const kinds: {
    value: Kind;
    labelKey: "feedbackKindFeedback" | "feedbackKindBug" | "feedbackKindQuestion";
  }[] = [
    { value: "feedback", labelKey: "feedbackKindFeedback" },
    { value: "bug", labelKey: "feedbackKindBug" },
    { value: "question", labelKey: "feedbackKindQuestion" },
  ];

  const handleSubmit = useCallback(async () => {
    const trimmed = message.trim();
    if (!trimmed || status === "sending" || status === "sent") return;
    setStatus("sending");
    try {
      await send({ data: { kind, message: trimmed, uiLang } });
      setStatus("sent");
      setMessage("");
      sentTimer.current = setTimeout(() => {
        setStatus("idle");
        onSent?.();
      }, 900);
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  }, [message, status, kind, uiLang, send, onSent]);

  const disabled = status === "sending" || status === "sent";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1.5">
        {kinds.map((k) => (
          <button
            key={k.value}
            type="button"
            onClick={() => setKind(k.value)}
            disabled={disabled}
            className={`flex-1 rounded-md border px-2 py-1.5 text-[11px] font-bold transition-colors disabled:opacity-60 ${
              kind === k.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-transparent text-muted-foreground hover:bg-secondary/40"
            }`}
          >
            {t(k.labelKey, uiLang)}
          </button>
        ))}
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value.slice(0, MAX_LEN))}
        placeholder={t("feedbackPlaceholder", uiLang)}
        disabled={disabled}
        maxLength={MAX_LEN}
        rows={4}
        className="w-full resize-none rounded-md border border-border bg-background px-2.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
      />

      {status === "error" && (
        <p className="text-xs text-destructive">{t("feedbackFailed", uiLang)}</p>
      )}

      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] text-muted-foreground">
          {message.length}/{MAX_LEN}
        </span>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!message.trim() || disabled}
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors disabled:opacity-45 ${
            status === "sent"
              ? "bg-success text-primary-foreground"
              : "bg-primary text-primary-foreground"
          }`}
        >
          {status === "sending" && <Spinner size={12} />}
          {status === "sent" ? (
            <Check className="h-3 w-3" strokeWidth={3} />
          ) : (
            status !== "sending" && <Send className="h-3 w-3" strokeWidth={2.5} />
          )}
          {status === "sent" ? t("feedbackSent", uiLang) : t("feedbackSend", uiLang)}
        </button>
      </div>
    </div>
  );
}
