import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use — RUACH Global Inc.",
  description: "Terms governing your use of the RUACH Global Inc. website.",
};

export default function TermsPage() {
  const updated = "1 August 2026";
  const email = "admin@ruachglobal.org";

  return (
    <div className="max-w-[800px] mx-auto px-7 py-16 pb-20">
      <div className="font-[family-name:var(--font-montserrat)] text-[12px] tracking-[.2em] uppercase text-[#8A7A55] mb-4">Legal</div>
      <h1 className="font-[family-name:var(--font-montserrat)] font-semibold text-[40px] text-[#0A3D62] mb-3">Terms of Use</h1>
      <p className="text-[14px] text-[#9AA5AF] mb-12">Last updated: {updated}</p>

      <div className="prose max-w-none text-[17px] leading-[1.8] text-[#4A5561] [&_h2]:font-[family-name:var(--font-montserrat)] [&_h2]:font-semibold [&_h2]:text-[22px] [&_h2]:text-[#0A3D62] [&_h2]:mt-10 [&_h2]:mb-3">
        <p>
          By accessing and using this website (&ldquo;the Site&rdquo;), operated by RUACH Global Inc. (&ldquo;the Organisation&rdquo;), you agree to the following terms. If you do not agree, please do not use the Site.
        </p>

        <h2>1. Use of the Site</h2>
        <p>
          The Site is provided for informational and ministry purposes. You agree to use it only for lawful purposes and in a manner that does not infringe the rights of others or restrict their use of the Site. You may not:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Submit false, misleading, or fraudulent information through any form.</li>
          <li>Attempt to gain unauthorised access to any part of the Site or its infrastructure.</li>
          <li>Use automated tools to scrape, crawl, or bulk-download content without permission.</li>
          <li>Transmit spam, malware, or any harmful content through contact or prayer forms.</li>
        </ul>

        <h2>2. Donations</h2>
        <p>
          All donations made through this Site are processed by Stripe. By donating, you confirm that you are authorised to use the payment method provided. Donations to RUACH Global Inc. are made in good faith. Receipts are issued by email for your records.
        </p>
        <p>
          RUACH Global Inc. is a registered non-profit organisation. Please consult your tax adviser regarding the deductibility of charitable contributions in your jurisdiction.
        </p>
        <p>
          If a donation was made in error, please contact us at <a href={`mailto:${email}`} className="text-[#0A3D62] underline hover:text-[#D4AF37]">{email}</a> within 14 days. Refunds are considered on a case-by-case basis.
        </p>

        <h2>3. Intellectual Property</h2>
        <p>
          All content on this Site — including text, images, audio, video, and design — is owned by or licensed to RUACH Global Inc. You may share links to content and quote brief passages for non-commercial, educational, or devotional purposes, provided you attribute the source. All other reproduction or redistribution requires written permission.
        </p>

        <h2>4. Third-Party Links</h2>
        <p>
          The Site may link to external websites (event venues, partner ministries, resource providers). We are not responsible for the content, privacy practices, or availability of those sites.
        </p>

        <h2>5. Disclaimer of Warranties</h2>
        <p>
          The Site is provided &ldquo;as is&rdquo; without warranties of any kind, express or implied. We do not warrant that the Site will be uninterrupted, error-free, or free of viruses. Ministry information (event dates, addresses, speaker details) is provided in good faith and subject to change without notice.
        </p>

        <h2>6. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by applicable law, RUACH Global Inc. shall not be liable for any indirect, incidental, or consequential damages arising from your use of or inability to use the Site.
        </p>

        <h2>7. Changes to These Terms</h2>
        <p>
          We may update these Terms of Use from time to time. The date at the top of this page indicates when they were last revised. Continued use of the Site after changes constitutes acceptance of the updated terms.
        </p>

        <h2>8. Contact</h2>
        <p>
          Questions about these terms should be directed to{" "}
          <a href={`mailto:${email}`} className="text-[#0A3D62] underline hover:text-[#D4AF37]">{email}</a>{" "}
          or via the <Link href="/contact" className="text-[#0A3D62] underline hover:text-[#D4AF37]">contact form</Link>.
        </p>
      </div>
    </div>
  );
}
