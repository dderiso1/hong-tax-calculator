import type { Metadata } from "next";
import { Bricolage_Grotesque, Open_Sans } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const body = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://francescahong.com"),
  title: "Will Hong's plan raise your taxes? | Tax the Rich Calculator",
  description:
    "Type your income. See your real number. Francesca Hong's plan asks the wealthiest Wisconsinites to pay their fair share — and uses every dollar to fund our schools.",
  openGraph: {
    title: "Will Hong's plan raise your taxes?",
    description:
      "For 99% of Wisconsinites, the answer is $0. See your real number.",
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
