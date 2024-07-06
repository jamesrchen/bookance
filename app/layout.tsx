import type { Metadata } from "next";
import { Literata } from "next/font/google";
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
      <body className={literata.className}>{children}</body>
    </html>
  );
}
