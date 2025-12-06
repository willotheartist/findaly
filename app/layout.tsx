import type { Metadata } from "next";
import "./globals.css";
import { Inter_Tight } from "next/font/google";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
});

export const metadata: Metadata = {
  title: "Findaly – Find what matters in your city",
  description:
    "Discover trusted clinics, coaches, restaurants and local places in one clean, modern directory.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={interTight.variable + " bg-[#eceae3]"}>
        {children}
      </body>
    </html>
  );
}
