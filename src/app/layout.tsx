import type { Metadata } from "next";
import { Cinzel, Lora } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-exo2",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SQL IRL | DB Rank",
  description: "Legend-inspired progression dashboard for database mastery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
