import { env } from "../env.server";

// Cloudflare Turnstile server-side verification.
// If TURNSTILE_SECRET is unset, verification is skipped (dev / opt-in).
export async function verifyTurnstile(token: string | undefined, req: Request): Promise<void> {
  const secret = env.turnstileSecret;
  if (!secret) return; // opt-in

  if (!token) throw new Response("Missing captcha token", { status: 400 });

  const ip = req.headers.get("cf-connecting-ip") ?? undefined;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  const json = (await res.json()) as { success?: boolean };
  if (!json.success) throw new Response("Captcha failed", { status: 403 });
}
