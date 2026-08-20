import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RUACH Global Inc. — Spirit · Mission",
    template: "%s | RUACH Global Inc.",
  },
  description:
    "RUACH Global Inc. is a faith-based, non-profit ministry — worship, discipleship, outreach and missions locally and across the nations.",
  keywords: ["church", "ministry", "missions", "outreach", "RUACH Global", "faith"],
  openGraph: {
    siteName: "RUACH Global Inc.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${montserrat.variable} ${openSans.variable}`}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
