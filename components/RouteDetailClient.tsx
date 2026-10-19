"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@/lib/form-resolver";
import { z } from "zod";
import { motion } from "framer-motion";
import { CalendarDays, Clock, Armchair, ShieldCheck } from "lucide-react";
import type { Route } from "@/lib/data";
import { BOOKING_FEE, seatPlan } from "@/lib/data";
import { addDaysISO, formatDateLong, formatKES, todayISO } from "@/lib/utils";
import { useBookingDraft } from "@/lib/store";
import SeatMap from "./SeatMap";

const passengerSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  idNumber: z.string().min(5, "Enter your ID or passport number"),
  phone: z
    .string()
    .min(9, "Enter a valid phone number")
    .regex(/^(?:\+?254|0)7\d{8}$/, "Use a Kenyan number like 0712345678"),
  email: z.string().email("Enter a valid email address"),
});

type PassengerForm = z.infer<typeof passengerSchema>;

export default function RouteDetailClient({
  route,
  initialDate,
  passengers,
}: {
  route: Route;
  initialDate: string;
  passengers: number;
}) {
  const router = useRouter();
  const [date, setDate] = useState(initialDate);
  const [maxSeats, setMaxSeats] = useState(Math.max(1, Math.min(6, passengers)));
  const [selected, setSelected] = useState<number[]>([]);
  const [seatError, setSeatError] = useState("");
  const setDraft = useBookingDraft((state) => state.setDraft);

  const plan = useMemo(() => seatPlan(route, date), [route, date]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PassengerForm>({
    resolver: zodResolver(passengerSchema),
    defaultValues: {
      fullName: "",
      idNumber: "",
      phone: "",
      email: "",
    },
  });

  const toggleSeat = (seat: number) => {
    setSeatError("");
    setSelected((prev) => {
      if (prev.includes(seat)) return prev.filter((s) => s !== seat);
      if (prev.length >= maxSeats) {
        setSeatError(`You can select up to ${maxSeats} seats for this search.`);
        return prev;
      }
      return [...prev, seat].sort((a, b) => a - b);
    });
  };

  const baseFare = route.baseFare * selected.length;
  const total = baseFare + BOOKING_FEE;

  const onSubmit = (passenger: PassengerForm) => {
    if (selected.length === 0) {
      setSeatError("Select at least one seat before continuing.");
      return;
    }
    setDraft({
      routeId: route.id,
      travelDate: date,
      seats: selected,
      passenger,
      baseFare,
      bookingFee: BOOKING_FEE,
      passengersRequested: maxSeats,
    });
    router.push("/checkout");
  };

  return (
    <div className="section__container">
      <div className="mb-6">
        <span className="chip">{route.operator}</span>
        <h1 className="mt-3 text-3xl font-bold md:text-4xl">
          {route.from} to {route.to}
        </h1>
        <p className="mt-2" style={{ color: "var(--text-light)" }}>
          {route.coach} service with {route.duration} of comfortable road travel
        </p>
      </div>

      <div
        className="mb-8 grid gap-4 rounded-2xl p-5 sm:grid-cols-3"
        style={{ backgroundColor: "var(--extra-light)" }}
      >
        <div className="flex items-center gap-3">
          <Clock size={20} style={{ color: "var(--primary-color)" }} aria-hidden="true" />
          <div>
            <div className="text-sm" style={{ color: "var(--text-light)" }}>
              Departure and arrival
            </div>
            <div className="font-semibold">
              {route.departure} to {route.arrival}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CalendarDays size={20} style={{ color: "var(--primary-color)" }} aria-hidden="true" />
          <div>
            <div className="text-sm" style={{ color: "var(--text-light)" }}>
              Travel date
            </div>
            <div className="font-semibold">{formatDateLong(date)}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ShieldCheck size={20} style={{ color: "var(--primary-color)" }} aria-hidden="true" />
          <div>
            <div className="text-sm" style={{ color: "var(--text-light)" }}>
              Live availability
            </div>
            <div className="font-semibold">{route.seatsAvailable} seats left</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="field">
              <label htmlFor="detail-date">Change date</label>
              <input
                id="detail-date"
                type="date"
                value={date}
                min={todayISO()}
                onChange={(e) => {
                  setDate(e.target.value || addDaysISO(todayISO(), 1));
                  setSelected([]);
                }}
              />
            </div>
            <div className="field">
              <label htmlFor="detail-pax">Passengers</label>
              <select
                id="detail-pax"
                value={maxSeats}
                onChange={(e) => {
                  const value = Number(e.target.value) || 1;
                  setMaxSeats(value);
                  setSelected((prev) => prev.slice(0, value));
                }}
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "passenger" : "passengers"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <SeatMap
            total={plan.total}
            reserved={Array.from(plan.reserved)}
            selected={selected}
            onToggle={toggleSeat}
            maxSelectable={maxSeats}
          />

          <form
            id="passenger-form"
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-2xl border border-[#e5e7eb] bg-white p-5"
            noValidate
          >
            <h4 className="mb-4 flex items-center gap-2 font-semibold">
              <Armchair size={18} style={{ color: "var(--primary-color)" }} aria-hidden="true" />
              Passenger details
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="field">
                <label htmlFor="fullName">Full name</label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="As printed on your ID"
                  {...register("fullName")}
                />
                {errors.fullName ? (
                  <span className="error" role="alert">
                    {errors.fullName.message}
                  </span>
                ) : null}
              </div>
              <div className="field">
                <label htmlFor="idNumber">ID number</label>
                <input
                  id="idNumber"
                  type="text"
                  placeholder="National ID or passport"
                  {...register("idNumber")}
                />
                {errors.idNumber ? (
                  <span className="error" role="alert">
                    {errors.idNumber.message}
                  </span>
                ) : null}
              </div>
              <div className="field">
                <label htmlFor="phone">Phone number</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="0712345678"
                  {...register("phone")}
                />
                {errors.phone ? (
                  <span className="error" role="alert">
                    {errors.phone.message}
                  </span>
                ) : null}
              </div>
              <div className="field">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                />
                {errors.email ? (
                  <span className="error" role="alert">
                    {errors.email.message}
                  </span>
                ) : null}
              </div>
            </div>
          </form>
        </div>

        <div>
          <motion.div
            className="rounded-2xl border border-[#e5e7eb] bg-white p-6 lg:sticky lg:top-24"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h4 className="mb-4 text-lg font-bold">Fare summary</h4>
            <div className="grid gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span style={{ color: "var(--text-light)" }}>
                  Base fare ({selected.length}{" "}
                  {selected.length === 1 ? "seat" : "seats"} x{" "}
                  {formatKES(route.baseFare)})
                </span>
                <span className="font-semibold">{formatKES(baseFare)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: "var(--text-light)" }}>Booking fee</span>
                <span className="font-semibold">{formatKES(BOOKING_FEE)}</span>
              </div>
              <div
                className="mt-1 flex items-center justify-between border-t pt-3"
                style={{ borderColor: "#e5e7eb" }}
              >
                <span className="font-semibold">Total</span>
                <span
                  className="text-xl font-bold"
                  style={{ color: "var(--primary-color)" }}
                >
                  {formatKES(total)}
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-xl p-3 text-sm" style={{ backgroundColor: "var(--extra-light)" }}>
              <span className="font-semibold">Selected seats:</span>{" "}
              {selected.length > 0 ? selected.join(", ") : "None yet"}
            </div>

            {seatError ? (
              <p role="alert" className="mt-3 text-sm" style={{ color: "#b91c1c" }}>
                {seatError}
              </p>
            ) : null}

            <motion.button
              type="submit"
              form="passenger-form"
              className="btn mt-5 w-full"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Pay Now
            </motion.button>
            <p
              className="mt-3 text-center text-xs"
              style={{ color: "var(--text-light)" }}
            >
              Pay safely with M-Pesa or card at checkout.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
