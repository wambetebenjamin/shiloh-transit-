import { NextResponse } from "next/server";
import { z } from "zod";
import { BOOKING_FEE, getRoute, seatPlan } from "@/lib/data";
import { generateRef, saveBookingRecord } from "@/lib/kv";
import type { StoredBooking } from "@/lib/store";

const schema = z.object({
  routeId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  seats: z
    .array(z.number().int().min(1))
    .min(1, "Select at least one seat")
    .max(10),
  passenger: z.object({
    fullName: z.string().min(2, "Full name is required"),
    idNumber: z.string().min(5, "ID number is required"),
    phone: z.string().min(9, "Phone number is required"),
    email: z.string().email("Valid email is required"),
  }),
  accountEmail: z.string().email().optional(),
});

/**
 * POST /api/bookings/create
 * Validates the payload with zod and returns a booking reference.
 */
export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const { routeId, date, seats, passenger, accountEmail } = parsed.data;

  const route = getRoute(routeId);
  if (!route) {
    return NextResponse.json({ error: "Route not found" }, { status: 404 });
  }

  const uniqueSeats = Array.from(new Set(seats)).sort((a, b) => a - b);
  if (uniqueSeats.some((s) => s > route.seatsTotal)) {
    return NextResponse.json({ error: "Invalid seat number" }, { status: 400 });
  }
  const plan = seatPlan(route, date);
  const reservedPicked = uniqueSeats.filter((s) => plan.isReserved(s));
  if (reservedPicked.length > 0) {
    return NextResponse.json(
      {
        error: "One or more selected seats are already reserved",
        seats: reservedPicked,
      },
      { status: 409 }
    );
  }

  const baseFare = route.baseFare * uniqueSeats.length;
  const total = baseFare + BOOKING_FEE;
  const ref = generateRef();

  const booking: StoredBooking = {
    ref,
    routeId: route.id,
    routeLabel: `${route.from} to ${route.to}`,
    operator: route.operator,
    from: route.from,
    to: route.to,
    date,
    departure: route.departure,
    arrival: route.arrival,
    duration: route.duration,
    seats: uniqueSeats,
    passenger,
    accountEmail,
    baseFare,
    bookingFee: BOOKING_FEE,
    total,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  await saveBookingRecord(booking);

  return NextResponse.json({ ref, booking }, { status: 201 });
}
