import type { StoredBooking } from "./store";
import { makeBookingRef } from "./utils";

/**
 * Booking persistence: uses @vercel/kv when configured, otherwise an
 * in-memory store so local development and preview builds work without
 * any environment variables.
 */

type BookingRecord = StoredBooking;

const globalStore = globalThis as unknown as {
  __shilohBookings?: Map<string, BookingRecord>;
};

function memory(): Map<string, BookingRecord> {
  if (!globalStore.__shilohBookings) {
    globalStore.__shilohBookings = new Map();
  }
  return globalStore.__shilohBookings;
}

function kvConfigured(): boolean {
  return Boolean(
    process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
  );
}

async function kvClient() {
  const { kv } = await import("@vercel/kv");
  return kv;
}

export function generateRef(): string {
  return makeBookingRef();
}

export async function saveBookingRecord(booking: BookingRecord): Promise<void> {
  if (kvConfigured()) {
    const kv = await kvClient();
    await kv.set(`booking:${booking.ref}`, booking);
    await kv.lpush(`bookings:${booking.passenger.email}`, booking.ref);
    return;
  }
  memory().set(booking.ref, booking);
}

export async function getBookingRecord(ref: string): Promise<BookingRecord | null> {
  if (kvConfigured()) {
    const kv = await kvClient();
    const booking = await kv.get<BookingRecord>(`booking:${ref}`);
    return booking ?? null;
  }
  return memory().get(ref) ?? null;
}

export async function updateBookingRecord(
  ref: string,
  patch: Partial<BookingRecord>
): Promise<BookingRecord | null> {
  const existing = await getBookingRecord(ref);
  if (!existing) return null;
  const updated = { ...existing, ...patch };
  if (kvConfigured()) {
    const kv = await kvClient();
    await kv.set(`booking:${ref}`, updated);
    return updated;
  }
  memory().set(ref, updated);
  return updated;
}
