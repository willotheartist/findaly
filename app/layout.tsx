import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "findaly",
  description: "Decision-first software discovery.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-(--color-bg) text-(--color-text-main)">
        <Header />
        {children}
      </body>
    </html>
  );
}
