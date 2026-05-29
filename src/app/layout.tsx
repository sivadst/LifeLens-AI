import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LifeLens AI — Intelligent Life Analytics Platform",
  description:
    "AI-powered health intelligence, nutrition analysis, visual recognition, and wellness tracking. Your personal AI copilot for a healthier, smarter life.",
  keywords: [
    "AI health",
    "nutrition analysis",
    "food recognition",
    "wellness tracking",
    "body analyzer",
    "damage detection",
    "AI assistant",
  ],
  authors: [{ name: "LifeLens AI" }],
  openGraph: {
    title: "LifeLens AI — Intelligent Life Analytics",
    description: "AI-powered health intelligence and wellness tracking platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-mesh min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
