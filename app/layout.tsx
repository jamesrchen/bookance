import type { Metadata } from "next";
import { Literata } from "next/font/google";
import { Analytics } from "@vercel/analytics/react"
import "./globals.css";

const literata = Literata({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bookance - Ask questions about texts",
  description: "Get answers to questions about books, research and other texts, backed by quotes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Analytics />
      <body className={literata.className}>{children}</body>
    </html>
  );
}
