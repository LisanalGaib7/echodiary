// Provider-agnostic AI factory. Switch providers via AI_PROVIDER env.
// Returns a LanguageModel usable directly with `ai` SDK (generateText/streamText).

import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import type { LanguageModel } from "ai";
import { requireAiApiKey, type AiProvider } from "./env.server";

// Per-provider default model. Override with modelOverride argument.
const DEFAULT_MODELS: Record<AiProvider, string> = {
  lovable: "google/gemini-3-flash-preview",
  openai: "gpt-4o-mini",
  openrouter: "google/gemini-2.5-flash",
  gemini: "gemini-2.5-flash",
};

export function getAiModel(modelOverride?: string): LanguageModel {
  const { provider, key } = requireAiApiKey();
  const model = modelOverride ?? DEFAULT_MODELS[provider];

  switch (provider) {
    case "lovable": {
      const p = createOpenAICompatible({
        name: "lovable-ai-gateway",
        baseURL: "https://ai.gateway.lovable.dev/v1",
        headers: { "Lovable-API-Key": key },
      });
      return p(model);
    }
    case "openai": {
      const p = createOpenAICompatible({
        name: "openai",
        baseURL: "https://api.openai.com/v1",
        headers: { Authorization: `Bearer ${key}` },
      });
      return p(model);
    }
    case "openrouter": {
      const p = createOpenAICompatible({
        name: "openrouter",
        baseURL: "https://openrouter.ai/api/v1",
        headers: { Authorization: `Bearer ${key}` },
      });
      return p(model);
    }
    case "gemini": {
      // Gemini's OpenAI-compatible endpoint
      const p = createOpenAICompatible({
        name: "gemini",
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
        headers: { Authorization: `Bearer ${key}` },
      });
      return p(model);
    }
  }
}
