import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from '@/components/auth/sessionWrapper';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Cuddly Coding Buddy 🐱‍💻",
  description: "Cuddly buddy that helps you code, write docs, and more! 🐱‍💻",
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
