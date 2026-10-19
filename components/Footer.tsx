import Link from "next/link";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";
import { POPULAR_ROUTES, WHATSAPP_LINK, WHATSAPP_NUMBER } from "@/lib/data";
import FooterSubscribe from "./FooterSubscribe";

/**
 * Footer built on the template footer structure and classes:
 * route links, legal links, WhatsApp link and social icons.
 */
export default function Footer() {
  return (
    <footer id="contact">
      <div className="section__container footer__container">
        <div className="footer__col">
          <div className="footer__logo">
            <Link href="/" className="logo">
              Shiloh Transit
            </Link>
          </div>
          <p>
            Book your seat. Ride with confidence. Intercity bus and matatu
            booking across Kenya, East Africa.
          </p>
          <ul className="footer__socials">
            <li>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Shiloh Transit on Facebook"
              >
                <Facebook size={18} />
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Shiloh Transit on Instagram"
              >
                <Instagram size={18} />
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Shiloh Transit on YouTube"
              >
                <Youtube size={18} />
              </a>
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Popular Routes</h4>
          <ul className="footer__links">
            {POPULAR_ROUTES.map((route) => (
              <li key={route.id}>
                <Link href={`/routes/${route.id}`}>
                  {route.from} to {route.to}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h4>Contact Us</h4>
          <ul className="footer__links">
            <li>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                <span>
                  <Phone size={16} />
                </span>
                +254 112 272 061
              </a>
            </li>
            <li>
              <a href="mailto:hello@shilohtransit.co.ke">
                <span>
                  <Mail size={16} />
                </span>
                hello@shilohtransit.co.ke
              </a>
            </li>
            <li>
              <span>
                <MapPin size={16} />
              </span>
              Nairobi, Kenya
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Quick Links</h4>
          <ul className="footer__links">
            <li>
              <Link href="/routes">All Routes</Link>
            </li>
            <li>
              <Link href="/my-bookings">My Bookings</Link>
            </li>
            <li>
              <Link href="/legal/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/legal/terms">Terms of Service</Link>
            </li>
            <li>
              <Link href="/legal/cookie-policy">Cookie Policy</Link>
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Subscribe</h4>
          <FooterSubscribe />
          <p style={{ marginTop: "1.5rem" }}>
            Prefer chat?{" "}
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--primary-color)", fontWeight: 600 }}
            >
              WhatsApp +254 112 272 061
            </a>
          </p>
        </div>
      </div>
      <div className="footer__bar">
        Copyright © 2026 Shiloh Transit. All rights reserved.
        <p>
          Built on the BusTraveller template designed by{" "}
          <a
            href="https://github.com/prashtt"
            target="_blank"
            rel="noopener noreferrer"
          >
            Code Prashtt
          </a>{" "}
          and distributed by{" "}
          <a
            className="text-white"
            href="https://www.themewagon.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            ThemeWagon
          </a>
          . WhatsApp support: +254 112 272 061.
        </p>
      </div>
    </footer>
  );
}
