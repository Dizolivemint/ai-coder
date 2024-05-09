import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from '@/components/auth/sessionWrapper';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Angel AI",
  description: "Angel that codes and mentors you to coding heaven",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </SessionWrapper>
  );
}
