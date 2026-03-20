import type { Metadata } from "next";
import { Noto_Serif, Noto_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "mukoko — I am because we are",
  description:
    "mukoko is a digital twin social ecosystem for Africa. Six apps, one identity, your sovereignty.",
  openGraph: {
    title: "mukoko — I am because we are",
    description:
      "A digital twin social ecosystem for Africa. Six apps, one identity, your sovereignty.",
    type: "website",
    url: "https://mukoko.com",
  },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${notoSerif.variable} ${notoSans.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
