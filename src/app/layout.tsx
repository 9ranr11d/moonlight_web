import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import Provider from "@redux/Provider";

import SessionProviderWrapper from "@components/common/SessionProviderWrapper";
import Header from "@components/common/Header";
import Footer from "@components/common/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MOONLIGHT",
  description: "Jin, Seob, Love",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <SessionProviderWrapper>
          <Provider>
            <Header />

            <main style={{ display: "grid", gridTemplateColumns: "1fr" }}>
              {children}
            </main>

            <Footer />
          </Provider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
