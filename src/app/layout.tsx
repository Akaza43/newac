import "./globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import Menu from "@/components/Menu";
import Nav from "@/ui/nav";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Akademi Crypto App",
  description: "Learn about crypto trading",
  icons: {
    icon: "/favicon.ico"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <html lang="en" suppressHydrationWarning={true} className="dark">
      <body className={`min-h-screen bg-black text-gray-200 ${inter.className}`}>
        <SessionProviderWrapper>
          <Nav />
          <main className="pt-16 pb-20">
            {children}
          </main>
          <Menu />
        </SessionProviderWrapper>
        <Analytics />
      </body>
    </html>
  );
}
