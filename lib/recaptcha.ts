export type RecaptchaResult = {
  ok: boolean;
  score: number;
  action?: string;
  challengeRequired: boolean;
  dev: boolean;
  reason?: string;
};

/**
 * Server-side Google reCAPTCHA v3 verification.
 * The secret key is read from the environment only and never sent to
 * the client. When no secret is configured (local development), checks
 * pass in dev mode so the site stays usable.
 */
export async function verifyRecaptcha(
  token: string,
  expectedAction?: string
): Promise<RecaptchaResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    return { ok: true, score: 1, challengeRequired: false, dev: true };
  }
  if (!token) {
    return {
      ok: false,
      score: 0,
      challengeRequired: false,
      dev: false,
      reason: "missing-token",
    };
  }
  try {
    const body = new URLSearchParams({ secret, response: token });
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      body,
      cache: "no-store",
    });
    const data = (await res.json()) as {
      success?: boolean;
      score?: number;
      action?: string;
      "error-codes"?: string[];
    };
    const score = typeof data.score === "number" ? data.score : 0;
    const actionOk =
      !expectedAction || !data.action || data.action === expectedAction;
    const challengeRequired = Boolean(data.success) && score < 0.5;
    const ok = Boolean(data.success) && score >= 0.5 && actionOk;
    return {
      ok,
      score,
      action: data.action,
      challengeRequired,
      dev: false,
      reason: data["error-codes"]?.join(","),
    };
  } catch {
    return {
      ok: false,
      score: 0,
      challengeRequired: false,
      dev: false,
      reason: "network-error",
    };
  }
}
