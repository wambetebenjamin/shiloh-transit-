import nodemailer from "nodemailer";

type MailOptions = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

/**
 * Sends mail through the configured SMTP server. When SMTP variables
 * are missing (local development) the message is logged and skipped
 * instead of failing the request.
 */
export async function sendMail(
  options: MailOptions
): Promise<{ sent: boolean; skippedReason?: string }> {
  const host = process.env.SMTP_HOST;
  const from = process.env.SMTP_FROM;
  if (!host || !from) {
    console.log("[shiloh-transit mail skipped]", options.subject);
    return { sent: false, skippedReason: "smtp-not-configured" };
  }
  const port = Number(process.env.SMTP_PORT || 587);
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
  await transporter.sendMail({
    from,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
  return { sent: true };
}
