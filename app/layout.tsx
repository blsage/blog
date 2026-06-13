import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import localFont from "next/font/local";
import { site } from "@/site.config";
import { Footer } from "./footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-primary",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: "italic",
  variable: "--font-secondary",
  display: "swap",
});

const handwriting = localFont({
  src: "./fonts/handwriting.ttf",
  variable: "--font-cursive",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    creator: site.twitter,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${newsreader.variable} ${handwriting.variable}`}
    >
      <body>
        <div className="top-fade" aria-hidden="true" />
        <div className="container">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
