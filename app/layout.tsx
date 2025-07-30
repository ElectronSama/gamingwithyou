import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SessionProvider from "@/components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GamingWithYou - Connect with Gamers",
  description: "Connect with gamers, book sessions, and discover amazing gaming experiences. Your ultimate gaming community platform.",
  keywords: ["gaming", "community", "bookings", "gamers", "esports", "tournaments"],
  authors: [{ name: "GamingWithYou Team" }],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: "GamingWithYou - Connect with Gamers",
    description: "Connect with gamers, book sessions, and discover amazing gaming experiences.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "GamingWithYou - Connect with Gamers",
    description: "Connect with gamers, book sessions, and discover amazing gaming experiences.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
