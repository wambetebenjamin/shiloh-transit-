import { NextResponse } from "next/server";
import { z } from "zod";
import { sendMail } from "@/lib/mail";
import { verifyRecaptcha } from "@/lib/recaptcha";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  captchaToken: z.string().default(""),
});

/**
 * POST /api/contact
 * Validates the reCAPTCHA token server-side, then sends the message
 * through nodemailer when SMTP is configured.
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
  const { name, email, message, captchaToken } = parsed.data;

  const captcha = await verifyRecaptcha(captchaToken, "contact");
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

  const to = process.env.SMTP_FROM || "hello@shilohtransit.co.ke";
  const mail = await sendMail({
    to,
    subject: `Shiloh Transit contact form from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p>${message.replace(
      /\n/g,
      "<br />"
    )}</p>`,
  });

  return NextResponse.json({
    ok: true,
    delivered: mail.sent,
    skippedReason: mail.skippedReason ?? null,
  });
}
