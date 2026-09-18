import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SerwistProvider } from "@serwist/next/react";
import { Toaster } from "@/components/ui/sonner";
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
  title: "Bill Tracker & Reminder",
  description: "Track recurring and one-off bills, and never miss a due date.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Bill Tracker",
  },
  other: {
    // Next only emits the modern unprefixed "mobile-web-app-capable" for
    // appleWebApp.capable. iOS Safari has historically keyed off this
    // classic prefixed name specifically to run installed PWAs without
    // its own address bar, so set it explicitly too.
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#f3f5f9",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SerwistProvider
          swUrl="/sw.js"
          disable={process.env.NODE_ENV === "development"}
          options={{ type: "classic" }}
        >
          {children}
        </SerwistProvider>
        <Toaster />
      </body>
    </html>
  );
}
