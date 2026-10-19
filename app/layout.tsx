import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import CookieConsent from "@/components/CookieConsent";
import VoiceTour from "@/components/VoiceTour";
import WhatsAppButton from "@/components/WhatsAppButton";
import SmoothScroll from "@/components/SmoothScroll";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Shiloh Transit | Book your seat. Ride with confidence.",
    template: "%s | Shiloh Transit",
  },
  description:
    "Shiloh Transit is a bus and matatu intercity booking platform for Kenya. Search routes, pick your seat on a live seat map, pay with M-Pesa and get your e-ticket instantly.",
  keywords: [
    "Kenya bus booking",
    "matatu booking",
    "intercity travel Kenya",
    "M-Pesa bus ticket",
    "e-ticket Kenya",
  ],
  openGraph: {
    title: "Shiloh Transit | Book your seat. Ride with confidence.",
    description:
      "Search any route across Kenya, pick your seat, pay via M-Pesa or card and receive your e-ticket instantly.",
    url: siteUrl,
    siteName: "Shiloh Transit",
    locale: "en_KE",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#2887ff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-KE">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <LoadingScreen />
        <Providers>
          <SmoothScroll />
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <VoiceTour />
          <WhatsAppButton />
          <CookieConsent />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
