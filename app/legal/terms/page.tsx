import type { Metadata } from "next";
import LegalArticle from "@/components/LegalArticle";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that apply when you book bus and matatu seats on the Shiloh Transit platform.",
};

export default function TermsPage() {
  return (
    <LegalArticle title="Terms of Service" updated="19 October 2026">
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your use of the
        Shiloh Transit booking platform, website and related services. By
        creating an account, searching for a route or completing a booking you
        agree to these Terms. If you do not agree, please do not use the
        platform.
      </p>

      <h2>1. The service</h2>
      <p>
        Shiloh Transit provides an online marketplace where travellers can
        search intercity bus and matatu routes operated by our partner
        operators, select seats, pay online and receive an electronic ticket.
        Shiloh Transit facilitates the booking and payment; the transport
        contract for the journey itself is between you and the operator shown
        on your ticket.
      </p>

      <h2>2. Accounts</h2>
      <p>
        You must provide accurate information when registering and keep your
        password confidential. You are responsible for all activity under your
        account. Contact us immediately if you suspect unauthorized use.
      </p>

      <h2>3. Bookings and tickets</h2>
      <p>
        A booking is confirmed only when payment is successful and an e-ticket
        with a booking reference is issued. The seat number on your e-ticket is
        reserved for you. You must carry a valid ID matching the passenger name
        on the ticket and be at the boarding point at least 15 minutes before
        departure. Tickets are personal and may be transferred only with our
        approval before departure.
      </p>

      <h2>4. Fares and fees</h2>
      <p>
        Fares shown on the platform include the base fare for your seat. A
        booking fee is added at checkout and shown in the fare summary before
        you pay. Fares may change with demand and season, but the price you pay
        is the price shown at checkout when your payment completes.
      </p>

      <h2>5. Payments</h2>
      <p>
        Payments are accepted through M-Pesa and major cards. Payments are
        protected by Google reCAPTCHA verification and processed by licensed
        payment providers. We never store full card numbers. If a payment is
        debited without a confirmed ticket, contact support and we will refund
        the amount in full.
      </p>

      <h2>6. Changes and cancellations</h2>
      <p>
        You may cancel an upcoming booking from the My Bookings dashboard.
        Cancellations within 2 hours of the scheduled departure time are
        blocked, and the seat is then non-refundable, because the operator
        holds the seat for you. Cancellations made more than 2 hours before
        departure are refunded to the original payment method, except where a
        non-refundable promotional fare clearly applies.
      </p>

      <h2>7. Operator changes and delays</h2>
      <p>
        Operators may substitute a similar coach or adjust departure times for
        operational or safety reasons. If we cancel a departure, you choose
        either a full refund or the next available departure on the same route.
        We are not liable for delays caused by traffic, weather, road
        conditions, mechanical breakdown or other events beyond reasonable
        control.
      </p>

      <h2>8. Conduct on board</h2>
      <p>
        Travellers must follow operator safety rules, wear seatbelts where
        fitted, and behave respectfully. Operators may refuse boarding or
        remove passengers who endanger others, without refund.
      </p>

      <h2>9. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the platform for fraudulent or unlawful bookings.</li>
        <li>Resell tickets without written permission.</li>
        <li>Attempt to breach platform security or overload the service.</li>
        <li>Scrape, copy or misuse platform content beyond personal use.</li>
      </ul>

      <h2>10. Liability</h2>
      <p>
        Our liability for any claim arising from a booking is limited to the
        fare you paid for that booking, to the extent permitted by Kenyan law.
        Nothing in these Terms limits liability for fraud, death or personal
        injury caused by negligence, or any other liability that cannot be
        limited by law.
      </p>

      <h2>11. Intellectual property</h2>
      <p>
        The Shiloh Transit name, logo, website design and content belong to
        Shiloh Transit or its licensors. You may not use them without written
        permission.
      </p>

      <h2>12. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. The latest version is
        always published on this page with a new last updated date. Continued
        use after changes means you accept the updated Terms.
      </p>

      <h2>13. Governing law</h2>
      <p>
        These Terms are governed by the laws of Kenya. Disputes are subject to
        the exclusive jurisdiction of the courts of Kenya. Questions can be
        sent to legal@shilohtransit.co.ke or WhatsApp +254112272061.
      </p>
    </LegalArticle>
  );
}
