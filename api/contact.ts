import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

  // Save to Supabase
  const { error: dbError } = await supabase.from("contact_submissions").insert({
    first_name: firstName.trim(),
    last_name: lastName.trim(),
    email: email.trim(),
    organization: organization?.trim() || null,
    phone: phone?.trim() || null,
    message: message.trim(),
  });

  if (dbError) console.error("Supabase insert error:", dbError);

  // Send email via Resend
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
  } catch (err) {
    console.error("Resend error:", err);
    // Still return success if DB saved — email is a secondary delivery
    if (!dbError) return res.status(200).json({ success: true });
    return res.status(500).json({ error: "Failed to send. Please try again." });
  }

  return res.status(200).json({ success: true });
}
