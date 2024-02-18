import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import Provider from "@redux/Provider";

import Header from "@components/common/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MOONLIGHT",
  description: "Jin, Seob, Love",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Provider>
          <Header />

          {children}
        </Provider>
      </body>
    </html>
  );
}
