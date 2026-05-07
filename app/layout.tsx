import type { Metadata, Viewport } from "next";
import { Open_Sans, Outfit } from "next/font/google";
import "./globals.css";

const display = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const body = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1e2957",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://hong-tax-calculator.vercel.app"),
  title: "Tax the Rich — Francesca Hong for Wisconsin",
  description:
    "Type your income. See your number. For 99 out of 100 of us, Francesca Hong's plan changes nothing. For the wealthiest, it's about damn time.",
  openGraph: {
    title: "Tax the Rich — Francesca Hong for Wisconsin",
    description:
      "It's about damn time the wealthiest Wisconsinites paid their share. See what Hong's plan does for you.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
