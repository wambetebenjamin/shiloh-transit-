"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Smartphone, CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { getRoute } from "@/lib/data";
import { formatKES, formatDateLong, isValidKenyanPhone } from "@/lib/utils";
import { useBookingDraft, saveBooking, type StoredBooking } from "@/lib/store";
import { useCaptchaToken } from "@/components/CaptchaProvider";

type Step = 0 | 1 | 2;

const STEPS = ["Details", "Payment", "Confirmation"];

export default function CheckoutPage() {
  const router = useRouter();
  const getToken = useCaptchaToken();
  const routeId = useBookingDraft((state) => state.routeId);
  const travelDate = useBookingDraft((state) => state.travelDate);
  const seats = useBookingDraft((state) => state.seats);
  const passenger = useBookingDraft((state) => state.passenger);
  const baseFare = useBookingDraft((state) => state.baseFare);
  const bookingFee = useBookingDraft((state) => state.bookingFee);
  const reset = useBookingDraft((state) => state.reset);

  const [mounted, setMounted] = useState(false);
  const [method, setMethod] = useState<"mpesa" | "card">("mpesa");
  const [phone, setPhone] = useState("");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });
  const [step, setStep] = useState<Step>(1);
  const [paying, setPaying] = useState(false);
  const [stk, setStk] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
    const passengerPhone = useBookingDraft.getState().passenger.phone;
    setPhone(passengerPhone);
  }, []);

  const route = useMemo(
    () => (routeId ? getRoute(routeId) : undefined),
    [routeId]
  );

  if (!mounted) {
    return (
      <div className="section__container">
        <p style={{ color: "var(--text-light)" }}>Loading checkout...</p>
      </div>
    );
  }

  if (!route || seats.length === 0) {
    return (
      <div className="section__container text-center">
        <h1 className="section__header">Your cart is empty</h1>
        <p className="section__description mb-6">
          Pick a route and seat first, then come back to pay.
        </p>
        <Link href="/routes" className="btn">
          Browse routes
        </Link>
      </div>
    );
  }

  const total = baseFare + bookingFee;

  const createBooking = async (): Promise<StoredBooking> => {
    const res = await fetch("/api/bookings/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        routeId: route.id,
        date: travelDate,
        seats: seats,
        passenger: passenger,
      }),
    });
    const data = (await res.json()) as {
      ref?: string;
      booking?: StoredBooking;
      error?: string;
    };
    if (!res.ok || !data.booking) {
      throw new Error(data.error || "Could not create your booking");
    }
    saveBooking(data.booking);
    return data.booking;
  };

  const confirmPaid = async (ref: string) => {
    await fetch("/api/payment/mpesa/callback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ref, status: "paid" }),
    });
  };

  const finishFlow = async (booking: StoredBooking) => {
    setStep(2);
    const updated = { ...booking, status: "paid" as const };
    saveBooking(updated);
    reset();
    await new Promise((r) => setTimeout(r, 700));
    router.push(`/booking-confirmation?ref=${booking.ref}`);
  };

  const payMpesa = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!isValidKenyanPhone(phone)) {
      setError("Enter a valid Kenyan mobile number, for example 0712345678.");
      return;
    }
    setPaying(true);
    try {
      const booking = await createBooking();
      const res = await fetch("/api/payment/mpesa/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, amount: total, ref: booking.ref }),
      });
      const data = (await res.json()) as {
        CustomerMessage?: string;
        CheckoutRequestID?: string;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error || "Could not start M-Pesa payment");
      setStk(
        data.CustomerMessage ||
          "Enter your M-PESA PIN on your phone to complete the payment."
      );
      await new Promise((r) => setTimeout(r, 2600));
      await confirmPaid(booking.ref);
      await finishFlow(booking);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setStk(null);
      setPaying(false);
    }
  };

  const payCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const digits = card.number.replace(/\s/g, "");
    if (digits.length < 14 || !/^\d+$/.test(digits)) {
      setError("Enter a valid card number.");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(card.expiry)) {
      setError("Enter the expiry as MM/YY.");
      return;
    }
    if (!/^\d{3,4}$/.test(card.cvv)) {
      setError("Enter the CVV printed on your card.");
      return;
    }
    setPaying(true);
    try {
      const captchaToken = await getToken("payment");
      const verifyRes = await fetch("/api/recaptcha/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: captchaToken, action: "payment" }),
      });
      const verify = (await verifyRes.json()) as { ok?: boolean };
      if (verify.ok === false) {
        throw new Error("Security check failed. Please try again.");
      }
      const booking = await createBooking();
      await confirmPaid(booking.ref);
      await finishFlow(booking);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setPaying(false);
    }
  };

  return (
    <div className="section__container">
      <div className="mb-8">
        <span className="chip">Checkout</span>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">
          {route.from} to {route.to}
        </h1>
        <p className="mt-2" style={{ color: "var(--text-light)" }}>
          {formatDateLong(travelDate)} with {route.operator}
        </p>
      </div>

      {/* Step indicator with progress animation */}
      <div className="mb-8 flex items-center gap-3" aria-label={`Step ${step + 1} of 3`}>
        {STEPS.map((label, index) => (
          <div key={label} className="flex flex-1 items-center gap-3 last:flex-none">
            <div className="flex items-center gap-2">
              <span
                className={`step-dot${index === step ? " is-active" : ""}${
                  index < step ? " is-done" : ""
                }`}
              >
                {index < step ? <Check size={16} /> : index + 1}
              </span>
              <span className="hidden text-sm font-semibold sm:inline">{label}</span>
            </div>
            {index < STEPS.length - 1 ? (
              <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-[#e5e7eb]">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ backgroundColor: "var(--primary-color)" }}
                  initial={{ width: "0%" }}
                  animate={{ width: index < step ? "100%" : "0%" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6">
          <h2 className="mb-4 text-xl font-bold">Payment method</h2>

          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setMethod("mpesa")}
              className="rounded-xl border-2 p-4 text-left transition"
              style={{
                borderColor:
                  method === "mpesa" ? "var(--primary-color)" : "#e5e7eb",
                backgroundColor:
                  method === "mpesa" ? "rgba(40,135,255,0.06)" : "#ffffff",
              }}
              aria-pressed={method === "mpesa"}
            >
              <span className="mb-1 flex items-center gap-2 font-bold">
                <Smartphone size={18} aria-hidden="true" /> M-Pesa
              </span>
              <span className="block text-sm" style={{ color: "var(--text-light)" }}>
                Primary. Instant STK push to your phone.
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMethod("card")}
              className="rounded-xl border-2 p-4 text-left transition"
              style={{
                borderColor:
                  method === "card" ? "var(--primary-color)" : "#e5e7eb",
                backgroundColor:
                  method === "card" ? "rgba(40,135,255,0.06)" : "#ffffff",
              }}
              aria-pressed={method === "card"}
            >
              <span className="mb-1 flex items-center gap-2 font-bold">
                <CreditCard size={18} aria-hidden="true" /> Card
              </span>
              <span className="block text-sm" style={{ color: "var(--text-light)" }}>
                Secondary. Visa and Mastercard, protected by reCAPTCHA.
              </span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {method === "mpesa" ? (
              <motion.form
                key="mpesa"
                id="mpesa-form"
                onSubmit={payMpesa}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 18 }}
                transition={{ duration: 0.3 }}
                className="grid gap-4"
              >
                <div className="field">
                  <label htmlFor="mpesa-phone">M-Pesa phone number</label>
                  <input
                    id="mpesa-phone"
                    type="tel"
                    placeholder="0712345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <button className="btn" type="submit" disabled={paying || Boolean(stk)}>
                  {paying ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" /> Processing...
                    </span>
                  ) : (
                    `Pay ${formatKES(total)} with M-Pesa`
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="card"
                id="card-form"
                onSubmit={payCard}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.3 }}
                className="grid gap-4"
              >
                <div className="field">
                  <label htmlFor="card-number">Card number</label>
                  <input
                    id="card-number"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="4242 4242 4242 4242"
                    value={card.number}
                    onChange={(e) =>
                      setCard((prev) => ({
                        ...prev,
                        number: e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 16)
                          .replace(/(.{4})/g, "$1 ")
                          .trim(),
                      }))
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="field">
                    <label htmlFor="card-expiry">Expiry</label>
                    <input
                      id="card-expiry"
                      type="text"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      placeholder="MM/YY"
                      value={card.expiry}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                        const value =
                          digits.length > 2
                            ? `${digits.slice(0, 2)}/${digits.slice(2)}`
                            : digits;
                        setCard((prev) => ({ ...prev, expiry: value }));
                      }}
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="card-cvv">CVV</label>
                    <input
                      id="card-cvv"
                      type="password"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      placeholder="123"
                      value={card.cvv}
                      onChange={(e) =>
                        setCard((prev) => ({
                          ...prev,
                          cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                        }))
                      }
                      required
                    />
                  </div>
                </div>
                <p
                  className="flex items-center gap-2 text-xs"
                  style={{ color: "var(--text-light)" }}
                >
                  <ShieldCheck size={14} aria-hidden="true" /> Protected by
                  Google reCAPTCHA v3 on this form.
                </p>
                <button className="btn" type="submit" disabled={paying}>
                  {paying ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" /> Processing...
                    </span>
                  ) : (
                    `Pay ${formatKES(total)} with Card`
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {stk ? (
              <motion.div
                key="stk"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-5 rounded-xl p-4"
                style={{
                  backgroundColor: "rgba(40,135,255,0.08)",
                  border: "1px solid rgba(40,135,255,0.35)",
                }}
                role="status"
              >
                <p className="mb-2 flex items-center gap-2 font-semibold">
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                  Waiting for confirmation
                </p>
                <p className="text-sm" style={{ color: "var(--text-light)" }}>
                  {stk}
                </p>
                <ol
                  className="mt-3 ml-5 list-decimal space-y-1 text-sm"
                  style={{ color: "var(--text-light)" }}
                >
                  <li>Check your phone for the M-Pesa prompt.</li>
                  <li>Enter your M-Pesa PIN.</li>
                  <li>Wait for the confirmation SMS from Shiloh Transit.</li>
                </ol>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {error ? (
            <p role="alert" className="mt-4 text-sm" style={{ color: "#b91c1c" }}>
              {error}
            </p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 lg:sticky lg:top-24 h-fit">
          <h2 className="mb-4 text-xl font-bold">Order summary</h2>
          <div className="grid gap-3 text-sm">
            <div className="flex justify-between">
              <span style={{ color: "var(--text-light)" }}>Route</span>
              <span className="font-semibold">
                {route.from} to {route.to}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--text-light)" }}>Operator</span>
              <span className="font-semibold">{route.operator}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--text-light)" }}>Date</span>
              <span className="font-semibold">{formatDateLong(travelDate)}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--text-light)" }}>Departure</span>
              <span className="font-semibold">
                {route.departure} to {route.arrival}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--text-light)" }}>Seats</span>
              <span className="font-semibold">{seats.join(", ")}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--text-light)" }}>Passenger</span>
              <span className="font-semibold">{passenger.fullName}</span>
            </div>
            <div
              className="mt-2 flex justify-between border-t pt-3"
              style={{ borderColor: "#e5e7eb" }}
            >
              <span style={{ color: "var(--text-light)" }}>Base fare</span>
              <span className="font-semibold">{formatKES(baseFare)}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--text-light)" }}>Booking fee</span>
              <span className="font-semibold">{formatKES(bookingFee)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-bold">Total</span>
              <span className="font-bold" style={{ color: "var(--primary-color)" }}>
                {formatKES(total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
