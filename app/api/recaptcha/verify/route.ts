import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyRecaptcha } from "@/lib/recaptcha";

const schema = z.object({
  token: z.string().default(""),
  action: z.string().optional(),
});

/**
 * POST /api/recaptcha/verify
 * Accepts a reCAPTCHA token and verifies it with Google server-side.
 * Returns the score and action. A score below 0.5 raises
 * challengeRequired so the client surfaces a visible reCAPTCHA v2
 * challenge before retrying the submission.
 */
export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const result = await verifyRecaptcha(parsed.data.token, parsed.data.action);
  return NextResponse.json({
    ok: result.ok,
    score: result.score,
    action: result.action ?? parsed.data.action ?? null,
    challengeRequired: result.challengeRequired,
    dev: result.dev,
    reason: result.reason ?? null,
  });
}
