import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/ui/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "!Game On!",
  description: "Rock, Paper, Scissors, Lizard, Spock",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <Header />
            {children}
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
