import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Happy Wife — збережіть гармонію в домі",
  description:
    "Жартівливий додаток для тих, хто замислюється скаржитись на кохану. Оберіть відповідь обережно.",
  openGraph: {
    title: "Happy Wife — збережіть гармонію в домі",
    description:
      "Жартівливий додаток для тих, хто замислюється скаржитись на кохану. Оберіть відповідь обережно.",
    locale: "uk_UA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uk"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
