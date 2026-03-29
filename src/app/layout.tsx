import type { Metadata } from "next";

import { Inter } from "next/font/google";

import { TooltipProvider } from "@/components/ui/tooltip";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const { className } = inter;

export const metadata: Metadata = {
  title: "Property Advice MVP",
  description: "Simple property advice from experts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={className}>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
