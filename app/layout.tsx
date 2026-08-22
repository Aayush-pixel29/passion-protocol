import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const SITE_URL = "https://passion-protocol.vercel.app";
const SITE_NAME = "Passion Protocol";
const DESCRIPTION =
  "Find your co-founder by vibe, not resume. Passion Protocol matches builders, designers, writers, and makers on pace, communication style, and risk tolerance — not job titles.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Passion Protocol — Find Your Co-Founder by Vibe",
    template: "%s | Passion Protocol",
  },
  description: DESCRIPTION,
  keywords: [
    "co-founder matching",
    "find a co-founder",
    "startup co-founder search",
    "collaborator matching app",
    "co-founder dating",
    "find a technical co-founder",
    "find a business co-founder",
  ],
  authors: [{ name: "Aayush Shelar" }],
  applicationName: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Passion Protocol — Find Your Co-Founder by Vibe",
    description: DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Passion Protocol — Match on energy, not a resume",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Passion Protocol — Find Your Co-Founder by Vibe",
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Passion Protocol",
  url: SITE_URL,
  description: DESCRIPTION,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${fraunces.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
