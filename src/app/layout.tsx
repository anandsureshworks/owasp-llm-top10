import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "OWASP LLM Top 10 Security Research Portal",
    template: "%s | OWASP LLM Top 10",
  },
  description:
    "A community-driven security research portal covering the OWASP Top 10 for Large Language Model Applications — write-ups, labs, demos, and tools.",
  keywords: [
    "OWASP",
    "LLM security",
    "AI security",
    "prompt injection",
    "red teaming",
    "LLM Top 10",
  ],
  authors: [{ name: "OWASP LLM Top 10 Community" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "OWASP LLM Top 10",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <TooltipProvider>
          <div className="flex min-h-screen flex-col">
            <NavBar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
