import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { firstName, lastName, email, organization, phone, message } = req.body ?? {};

  if (!firstName?.trim()) return res.status(400).json({ error: "First name is required." });
  if (!lastName?.trim()) return res.status(400).json({ error: "Last name is required." });
  if (!email?.trim() || !isValidEmail(email)) return res.status(400).json({ error: "A valid work email is required." });
  if (!message?.trim()) return res.status(400).json({ error: "Message is required." });

  try {
    await resend.emails.send({
      from: "noreply@socialboothco.com",
      to: "memories@socialboothco.com",
      reply_to: email,
      subject: `New contact form submission from ${firstName} ${lastName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <table style="border-collapse:collapse;width:100%;font-family:sans-serif">
          <tr><td style="padding:8px 12px;font-weight:bold;background:#f5f5f5">Name</td><td style="padding:8px 12px">${firstName} ${lastName}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:bold;background:#f5f5f5">Email</td><td style="padding:8px 12px">${email}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:bold;background:#f5f5f5">Organization</td><td style="padding:8px 12px">${organization || "—"}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:bold;background:#f5f5f5">Phone</td><td style="padding:8px 12px">${phone || "—"}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:bold;background:#f5f5f5;vertical-align:top">Message</td><td style="padding:8px 12px;white-space:pre-wrap">${message}</td></tr>
        </table>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Resend error:", err);
    return res.status(500).json({ error: "Failed to send email. Please try again." });
  }
}
