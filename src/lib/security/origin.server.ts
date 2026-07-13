import { env } from "../env.server";

// Reject requests whose Origin/Referer is not in ALLOWED_ORIGINS.
// If ALLOWED_ORIGINS is unset (dev), this is a no-op.
export function assertAllowedOrigin(req: Request): void {
  const allowed = env.allowedOrigins;
  if (allowed.length === 0) return;

  const origin = req.headers.get("origin") ?? deriveOriginFromReferer(req.headers.get("referer"));
  if (!origin || !allowed.includes(origin)) {
    throw new Response("Forbidden", { status: 403 });
  }
}

function deriveOriginFromReferer(referer: string | null): string | null {
  if (!referer) return null;
  try {
    const u = new URL(referer);
    return `${u.protocol}//${u.host}`;
  } catch {
    return null;
  }
}
