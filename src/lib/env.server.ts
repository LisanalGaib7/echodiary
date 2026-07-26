// Centralized server-side env access.
// Every other server module reads env through this file so migration
// (Vercel / Netlify / self-host) only requires setting the same vars.

export type AiProvider = "lovable" | "openai" | "openrouter" | "gemini";

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env: ${name}`);
  return v;
}

function optional(name: string): string | undefined {
  const v = process.env[name];
  return v && v.length > 0 ? v : undefined;
}

export const env = {
  get aiProvider(): AiProvider {
    return (process.env.AI_PROVIDER as AiProvider | undefined) ?? "openrouter";
  },
  get lovableApiKey() {
    return optional("LOVABLE_API_KEY");
  },
  get openaiApiKey() {
    return optional("OPENAI_API_KEY");
  },
  get openrouterApiKey() {
    return optional("OPENROUTER_API_KEY");
  },
  get geminiApiKey() {
    return optional("GEMINI_API_KEY");
  },
  get turnstileSecret() {
    return optional("TURNSTILE_SECRET");
  },
  // Comma-separated list of allowed origins for AI endpoints.
  // Empty -> no origin check (dev only).
  get allowedOrigins(): string[] {
    const raw = optional("ALLOWED_ORIGINS");
    if (!raw) return [];
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  },
};

export function requireAiApiKey(): { provider: AiProvider; key: string } {
  const provider = env.aiProvider;
  const key =
    provider === "lovable"
      ? env.lovableApiKey
      : provider === "openai"
        ? env.openaiApiKey
        : provider === "openrouter"
          ? env.openrouterApiKey
          : provider === "gemini"
            ? env.geminiApiKey
            : undefined;
  if (!key) throw new Error("AI service unavailable");
  return { provider, key };
}

export { required };
