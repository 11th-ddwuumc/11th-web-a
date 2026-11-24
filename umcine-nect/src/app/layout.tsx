import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";

import Providers from "./providers";
import { Header } from "../components/layout/header";
import { Footer } from "../components/layout/footer";
import { FooterVisibility } from
  "../components/layout/footer-visibility";

export const metadata: Metadata = {
  title: "UMCine",
  description: "영화 검색과 평가 서비스",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <div className="flex min-h-dvh flex-col">
            <Header />
            <div className="flex flex-1 flex-col">
              {children}
            </div>
            <Suspense fallback={<Footer />}>
              <FooterVisibility>
                <Footer />
              </FooterVisibility>
            </Suspense>
          </div>
        </Providers>
      </body>
    </html>
  );
}