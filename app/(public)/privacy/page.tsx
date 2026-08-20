import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — RUACH Global Inc.",
  description: "How RUACH Global Inc. collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  const updated = "1 August 2026";
  const email = "admin@ruachglobal.org";

  return (
    <div className="max-w-[800px] mx-auto px-7 py-16 pb-20">
      <div className="font-[family-name:var(--font-montserrat)] text-[12px] tracking-[.2em] uppercase text-[#8A7A55] mb-4">Legal</div>
      <h1 className="font-[family-name:var(--font-montserrat)] font-semibold text-[40px] text-[#0A3D62] mb-3">Privacy Policy</h1>
      <p className="text-[14px] text-[#9AA5AF] mb-12">Last updated: {updated}</p>

      <div className="prose max-w-none text-[17px] leading-[1.8] text-[#4A5561] [&_h2]:font-[family-name:var(--font-montserrat)] [&_h2]:font-semibold [&_h2]:text-[22px] [&_h2]:text-[#0A3D62] [&_h2]:mt-10 [&_h2]:mb-3">
        <p>
          RUACH Global Inc. (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;the Organisation&rdquo;) is a faith-based non-profit ministry. This Privacy Policy explains how we collect, use, and protect personal information submitted through this website.
        </p>

        <h2>1. Information We Collect</h2>
        <p>We collect personal information only when you voluntarily provide it, including:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Contact forms:</strong> name, email address, phone number, and message content.</li>
          <li><strong>Newsletter sign-up:</strong> name and email address.</li>
          <li><strong>Volunteer registration:</strong> name, email address, phone number, city, address, areas of interest, availability, and skills.</li>
          <li><strong>Prayer requests:</strong> name (optional), email address, and prayer request text.</li>
          <li><strong>Donations:</strong> name, email address, amount, and payment card details (processed securely by Stripe — we never store raw card numbers).</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>To respond to contact form enquiries within two business days.</li>
          <li>To send the monthly mission newsletter (subscribers only; unsubscribe anytime).</li>
          <li>To follow up with volunteers regarding service opportunities.</li>
          <li>To forward prayer requests to our intercessory team.</li>
          <li>To process donations and email tax receipts.</li>
          <li>To improve the website and ministry services.</li>
        </ul>

        <h2>3. Third-Party Services</h2>
        <p>We use the following services to operate this website. Each has its own privacy policy:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Stripe</strong> — payment processing for donations. Card data is never transmitted to our servers.</li>
          <li><strong>Resend</strong> — transactional email delivery (receipts, notifications).</li>
          <li><strong>Cloudinary</strong> — image and media hosting.</li>
          <li><strong>MongoDB Atlas</strong> — encrypted cloud database for form submissions and content.</li>
        </ul>
        <p>We do not sell, rent, or trade your personal information to any third party.</p>

        <h2>4. Data Retention</h2>
        <p>
          We retain contact form messages and volunteer registrations for a maximum of two years. Donation records are kept for seven years as required for financial accountability reporting. Newsletter subscribers are retained until they unsubscribe. You may request deletion of your data at any time (see Section 6).
        </p>

        <h2>5. Cookies & Analytics</h2>
        <p>
          This website does not currently use advertising or tracking cookies. Session cookies may be set for admin users only. We do not use third-party analytics services that track individual visitors across sites.
        </p>

        <h2>6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Access the personal information we hold about you.</li>
          <li>Request correction of inaccurate data.</li>
          <li>Request deletion of your data (subject to legal retention obligations).</li>
          <li>Withdraw consent to newsletter communications at any time.</li>
        </ul>
        <p>
          To exercise these rights, email us at <a href={`mailto:${email}`} className="text-[#0A3D62] underline hover:text-[#D4AF37]">{email}</a>.
        </p>

        <h2>7. Security</h2>
        <p>
          All data is transmitted over HTTPS. Database records are stored in encrypted cloud infrastructure. Payment data is handled exclusively by Stripe and is never stored on our servers.
        </p>

        <h2>8. Contact</h2>
        <p>
          For privacy-related questions or requests, please contact us at{" "}
          <a href={`mailto:${email}`} className="text-[#0A3D62] underline hover:text-[#D4AF37]">{email}</a>{" "}
          or use the <Link href="/contact" className="text-[#0A3D62] underline hover:text-[#D4AF37]">contact form</Link>.
        </p>
      </div>
    </div>
  );
}
