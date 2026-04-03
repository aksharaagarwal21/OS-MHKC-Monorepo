import type { Metadata } from "next";
import "./globals.css";
import SideNav from "@/components/shared/SideNav";

export const metadata: Metadata = {
  title: "MHKC — Mental Health Knowledge Companion",
  description:
    "AI-powered mental health platform with multi-persona therapy, mood tracking, and culturally-sensitive support.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SideNav />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
