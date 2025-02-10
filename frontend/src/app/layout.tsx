"use client";

import { Inter } from "next/font/google";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import "../styles/globals.scss";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <I18nextProvider i18n={i18n}>
        <body className={`${inter.className} dark:bg-gray-900 bg-gray-100`}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </body>
      </I18nextProvider>
    </html>
  );
}
