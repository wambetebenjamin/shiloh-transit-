import { NextResponse } from "next/server";
import { z } from "zod";
import { createUser, findUserByEmail } from "@/lib/users";
import { verifyRecaptcha } from "@/lib/recaptcha";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  captchaToken: z.string().default(""),
});

/**
 * POST /api/auth/register
 * Creates an email/password account after server-side reCAPTCHA
 * verification.
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
  const { name, email, password, captchaToken } = parsed.data;

  const captcha = await verifyRecaptcha(captchaToken, "signup");
  if (!captcha.ok) {
    return NextResponse.json(
      {
        error: "Captcha verification failed",
        challengeRequired: captcha.challengeRequired,
        score: captcha.score,
      },
      { status: 400 }
    );
  }

  if (findUserByEmail(email)) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 }
    );
  }

  const user = createUser(name, email, password);
  if (!user) {
    return NextResponse.json(
      { error: "Could not create the account" },
      { status: 409 }
    );
  }
  return NextResponse.json({ ok: true, user: { email: user.email, name: user.name } }, { status: 201 });
}
