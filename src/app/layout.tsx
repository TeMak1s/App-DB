import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";

const pressStart = Press_Start_2P({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: "400",
});

const vt323 = VT323({
  variable: "--font-exo2",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "SQL IRL | DB Rank",
  description: "Undertale-inspired progression dashboard for database mastery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${pressStart.variable} ${vt323.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
