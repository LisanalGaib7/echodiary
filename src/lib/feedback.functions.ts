// Feedback/inquiry delivery. UI calls sendFeedback() only — delivery
// mechanism (currently Telegram) is isolated here so it can be swapped
// without touching callers.

import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { env } from "./env.server";
import { assertAllowedOrigin } from "./security/origin.server";

const KindSchema = z.enum(["feedback", "bug", "question"]);

const InputSchema = z.object({
  kind: KindSchema,
  message: z.string().trim().min(1).max(1500),
  uiLang: z.string().max(10),
});

const KIND_LABEL: Record<z.infer<typeof KindSchema>, string> = {
  feedback: "Feedback",
  bug: "Bug",
  question: "Question",
};

export const sendFeedback = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const req = getRequest();
    if (req) assertAllowedOrigin(req);

    const token = env.telegramBotToken;
    const chatId = env.telegramChatId;
    if (!token || !chatId) {
      throw new Error("Feedback delivery is not configured");
    }

    // Plain text only — no parse_mode. User-supplied text can contain
    // Markdown/HTML special characters that would otherwise break
    // formatting or fail the Telegram API call outright (400).
    const text = [`[echodiary] ${KIND_LABEL[data.kind]} (${data.uiLang})`, "", data.message].join(
      "\n",
    );

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });

    if (!res.ok) {
      throw new Error(`Telegram delivery failed (${res.status})`);
    }

    return { ok: true };
  });
