import type { Metadata } from "next";
import LegalArticle from "@/components/LegalArticle";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "The cookies and local storage used by Shiloh Transit and how to manage your consent.",
};

export default function CookiePolicyPage() {
  return (
    <LegalArticle title="Cookie Policy" updated="19 October 2026">
      <p>
        This Cookie Policy explains how Shiloh Transit uses cookies, local
        storage and similar technologies on our website. It should be read
        together with our{" "}
        <a href="/legal/privacy-policy" style={{ color: "var(--primary-color)" }}>
          Privacy Policy
        </a>
        . We follow the Kenya Data Protection Act 2019 and ask for your consent
        before storing non necessary items on your device.
      </p>

      <h2>1. What cookies and storage are</h2>
      <p>
        Cookies are small text files placed on your device by a website. Local
        storage is a similar browser feature that keeps data on your device
        without sending it to a server automatically. Both can remember your
        choices between visits.
      </p>

      <h2>2. How we use them</h2>
      <ul>
        <li>
          <strong>Necessary:</strong> keep you signed in, protect forms against
          abuse, remember your cookie consent choice and secure checkout
          sessions. These always stay on because the site cannot work without
          them.
        </li>
        <li>
          <strong>Functional:</strong> remember route and form preferences such
          as the cities you search most often.
        </li>
        <li>
          <strong>Analytics:</strong> help us understand which pages and routes
          travellers use so we can improve performance and content.
        </li>
        <li>
          <strong>Marketing:</strong> used only if you agree, to measure and
          show relevant Shiloh Transit offers on other platforms.
        </li>
      </ul>

      <h2>3. Local storage keys we set</h2>
      <ul>
        <li>
          <code>shiloh_transit_consent</code>: stores your cookie preference
          choices so the consent banner does not reappear.
        </li>
        <li>
          <code>shiloh_transit_draft</code>: keeps your in progress booking
          (route, seats and passenger form) while you move between pages.
        </li>
        <li>
          <code>shiloh_transit_bookings</code>: keeps your confirmed tickets on
          your device so you can reopen them from My Bookings.
        </li>
        <li>
          Auth session cookies: keep you signed in securely when you use an
          account.
        </li>
      </ul>

      <h2>4. Third party cookies</h2>
      <p>
        Where you consent, third parties such as Google (analytics, reCAPTCHA)
        and social networks may set cookies through our pages. Google reCAPTCHA
        helps protect forms from spam and abuse and may process technical data
        such as IP address under Google&apos;s own policies. Payment flows with
        M-Pesa and card providers may also set strictly necessary cookies.
      </p>

      <h2>5. Managing your consent</h2>
      <p>
        When you first visit the site a banner offers{" "}
        <strong>Accept All</strong> and <strong>Manage Preferences</strong>. In
        Manage Preferences you can switch Functional, Analytics and Marketing
        categories on or off. Necessary storage is always on. Your choice is
        stored under the key{" "}
        <code>shiloh_transit_consent</code> and the banner will not show again
        after you save a choice.
      </p>

      <h2>6. Changing or clearing choices</h2>
      <p>
        You can clear site data in your browser settings at any time, which
        removes the saved consent and the banner will ask again on your next
        visit. You can also block or delete cookies through your browser, though
        parts of the booking flow may then not work as expected.
      </p>

      <h2>7. Do not track signals</h2>
      <p>
        Some browsers send Do Not Track signals. Where a browser signal asks
        for reduced tracking and you have not consented to analytics or
        marketing, we treat the site as analytics off and marketing off.
      </p>

      <h2>8. Updates</h2>
      <p>
        We may update this policy when our use of cookies changes. The latest
        version always appears on this page with its last updated date.
      </p>

      <h2>9. Contact</h2>
      <p>
        Questions about this Cookie Policy can be sent to
        privacy@shilohtransit.co.ke or WhatsApp +254112272061.
      </p>
    </LegalArticle>
  );
}
