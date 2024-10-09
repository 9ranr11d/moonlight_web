import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Script from "next/script";

import "./globals.css";

import Provider from "@redux/Provider";

import Header from "@components/common/Header";
import Footer from "@components/common/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MOONLIGHT",
  description: "Jin, Seob, Love",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      {/* <Script
        strategy="afterInteractive"
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&submodules=geocoder`}
      /> */}

      <body className={inter.className}>
        <Provider>
          <Header />

          {children}

          <Footer />
        </Provider>
      </body>
    </html>
  );
}
