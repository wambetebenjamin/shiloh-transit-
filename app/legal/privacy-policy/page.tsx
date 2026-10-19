import type { Metadata } from "next";
import LegalArticle from "@/components/LegalArticle";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Shiloh Transit collects, uses and protects your personal data under the Kenya Data Protection Act 2019.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalArticle title="Privacy Policy" updated="19 October 2026">
      <p>
        Shiloh Transit (&quot;Shiloh Transit&quot;, &quot;we&quot;, &quot;us&quot;)
        operates a bus and matatu intercity booking platform for travellers in
        Kenya and East Africa. This Privacy Policy explains what personal data we
        collect, why we collect it, and the rights you have over that data. We
        process personal data in line with the Kenya Data Protection Act 2019
        and other applicable data protection laws.
      </p>

      <h2>1. Data we collect</h2>
      <p>We collect the following categories of personal data:</p>
      <ul>
        <li>
          <strong>Account data:</strong> name and email address when you create
          an account or sign in.
        </li>
        <li>
          <strong>Booking data:</strong> passenger full name, ID or passport
          number, phone number, email address, seat selection and travel
          details for each booking you make.
        </li>
        <li>
          <strong>Payment data:</strong> M-Pesa phone number or card payment
          confirmations. Card numbers are never stored on our servers.
        </li>
        <li>
          <strong>Technical data:</strong> device type, browser and pages
          visited, collected only where you consent to analytics cookies.
        </li>
        <li>
          <strong>Communications:</strong> messages you send through our
          contact form or WhatsApp support channel.
        </li>
      </ul>

      <h2>2. How we use your data</h2>
      <p>We use personal data to:</p>
      <ul>
        <li>Create and manage bookings and issue your e-ticket.</li>
        <li>Process payments and send payment confirmations.</li>
        <li>Verify your identity when you sign in to your account.</li>
        <li>Answer support requests and send service updates about your trip.</li>
        <li>Improve the platform, subject to your cookie consent choices.</li>
        <li>Meet legal and regulatory obligations in Kenya.</li>
      </ul>

      <h2>3. Legal bases for processing</h2>
      <p>
        We rely on the performance of a contract to deliver the booking you
        request, legitimate interests to keep the platform secure and improve
        our service, consent for analytics and marketing cookies, and legal
        obligations where the law requires us to retain certain records.
      </p>

      <h2>4. Sharing your data</h2>
      <p>We share data only with:</p>
      <ul>
        <li>
          The operator handling your journey, limited to the details needed for
          boarding (name, seat and route).
        </li>
        <li>
          Payment providers such as Safaricom M-Pesa and card processors to
          complete your transaction.
        </li>
        <li>
          Service providers that host our platform, send transactional email or
          verify reCAPTCHA tokens, under contractual data protection terms.
        </li>
      </ul>
      <p>
        We do not sell your personal data. We do not transfer personal data
        outside Kenya unless the recipient provides adequate protection or you
        consent, as required by the Kenya Data Protection Act 2019.
      </p>

      <h2>5. Retention</h2>
      <p>
        Booking records are retained for as long as needed to deliver your
        trip and to meet accounting and legal requirements in Kenya, typically
        up to seven years. Account data is kept until you delete your account.
        Marketing data is kept until you withdraw consent.
      </p>

      <h2>6. Your rights</h2>
      <p>Subject to the law, you have the right to:</p>
      <ul>
        <li>Access the personal data we hold about you.</li>
        <li>Correct inaccurate or incomplete data.</li>
        <li>Request deletion of your data.</li>
        <li>Object to or restrict certain processing.</li>
        <li>Withdraw consent at any time, without affecting past processing.</li>
        <li> lodge a complaint with the Office of the Data Protection Commissioner of Kenya.</li>
      </ul>

      <h2>7. Security</h2>
      <p>
        We protect data with access controls, encryption in transit, secured
        servers and limited staff access. No system is perfectly secure, so we
        also review our practices regularly and respond promptly to reported
        issues.
      </p>

      <h2>8. Children</h2>
      <p>
        The platform is intended for travellers aged 18 and above. Bookings for
        minors must be made by a parent or guardian who consents to the
        processing of the minor&apos;s boarding details.
      </p>

      <h2>9. Cookies</h2>
      <p>
        We use necessary storage to run the site and optional cookies for
        analytics and marketing only with your consent. See our{" "}
        <a href="/legal/cookie-policy" style={{ color: "var(--primary-color)" }}>
          Cookie Policy
        </a>{" "}
        for details.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions or requests about this policy can be sent to
        privacy@shilohtransit.co.ke or through WhatsApp at +254112272061.
        Shiloh Transit is based in Nairobi, Kenya.
      </p>
    </LegalArticle>
  );
}
