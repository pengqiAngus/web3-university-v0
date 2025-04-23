import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Web3Provider } from "@/lib/web3-context";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Web3Learn - Blockchain Education Platform",
  description: "Learn blockchain development and earn tokens",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Provider>
          {children}
          <Toaster />
        </Web3Provider>
      </body>
    </html>
  );
}
