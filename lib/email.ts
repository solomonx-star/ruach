import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function escHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const FROM = "RUACH Global <noreply@ruachglobal.org>";
const ADMIN = process.env.ADMIN_EMAIL ?? "admin@ruachglobal.org";

export async function sendContactNotification(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  return resend.emails.send({
    from: FROM,
    to: ADMIN,
    subject: `Contact: ${data.subject}`,
    html: `<p><b>From:</b> ${escHtml(data.name)} &lt;${escHtml(data.email)}&gt;</p>
           <p><b>Phone:</b> ${escHtml(data.phone ?? "—")}</p>
           <p><b>Subject:</b> ${escHtml(data.subject)}</p>
           <p><b>Message:</b></p><p>${escHtml(data.message).replace(/\n/g, "<br>")}</p>`,
  });
}

export async function sendVolunteerNotification(data: {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  address?: string;
  interests: string[];
  availability: string[];
  skills?: string;
}) {
  return resend.emails.send({
    from: FROM,
    to: ADMIN,
    subject: `New volunteer: ${data.name}`,
    html: `<p><b>Name:</b> ${escHtml(data.name)}</p>
           <p><b>Email:</b> ${escHtml(data.email)}</p>
           <p><b>Phone:</b> ${escHtml(data.phone ?? "—")}</p>
           <p><b>City:</b> ${escHtml(data.city ?? "—")}</p>
           <p><b>Interests:</b> ${escHtml((data.interests ?? []).join(", "))}</p>
           <p><b>Availability:</b> ${escHtml((data.availability ?? []).join(", "))}</p>
           <p><b>Skills:</b> ${escHtml(data.skills ?? "—")}</p>`,
  });
}

export async function sendDonationReceipt(data: {
  to: string;
  name: string;
  amount: number;
  currency: string;
  purpose: string;
  type: "one-time" | "recurring";
}) {
  return resend.emails.send({
    from: FROM,
    to: data.to,
    subject: `Thank you for your gift to RUACH Global Inc.`,
    html: `<p>Dear ${data.name},</p>
           <p>Thank you for your generous ${data.type === "recurring" ? "recurring monthly " : ""}gift of <b>${data.currency.toUpperCase()} ${(data.amount / 100).toFixed(2)}</b> designated to <b>${data.purpose}</b>.</p>
           <p>Your contribution is acknowledged and deeply appreciated. This email serves as your receipt for tax purposes.</p>
           <p>In faith and service,<br>RUACH Global Inc.</p>`,
  });
}
