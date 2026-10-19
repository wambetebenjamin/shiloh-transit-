"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type PassengerDetails = {
  fullName: string;
  idNumber: string;
  phone: string;
  email: string;
};

type BookingDraftState = {
  routeId: string | null;
  travelDate: string;
  seats: number[];
  passenger: PassengerDetails;
  baseFare: number;
  bookingFee: number;
  passengersRequested: number;
  setDraft: (draft: Partial<BookingDraftState>) => void;
  toggleSeat: (seat: number, maxSeats: number) => void;
  reset: () => void;
};

const emptyPassenger: PassengerDetails = {
  fullName: "",
  idNumber: "",
  phone: "",
  email: "",
};

const memoryShim = (): Storage => ({
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
  clear: () => undefined,
  key: () => null,
  length: 0,
});

export const useBookingDraft = create<BookingDraftState>()(
  persist(
    (set, get) => ({
      routeId: null,
      travelDate: "",
      seats: [],
      passenger: { ...emptyPassenger },
      baseFare: 0,
      bookingFee: 50,
      passengersRequested: 1,
      setDraft: (draft) => set(draft),
      toggleSeat: (seat, maxSeats) => {
        const seats = get().seats;
        if (seats.includes(seat)) {
          set({ seats: seats.filter((s) => s !== seat) });
        } else if (seats.length < maxSeats) {
          set({ seats: [...seats, seat].sort((a, b) => a - b) });
        }
      },
      reset: () =>
        set({
          routeId: null,
          travelDate: "",
          seats: [],
          passenger: { ...emptyPassenger },
          baseFare: 0,
          bookingFee: 50,
          passengersRequested: 1,
        }),
    }),
    {
      name: "shiloh_transit_draft",
      storage: createJSONStorage<BookingDraftState>(() =>
        typeof window !== "undefined" ? window.localStorage : (memoryShim() as Storage)
      ),
    }
  )
);

export type StoredBooking = {
  ref: string;
  routeId: string;
  routeLabel: string;
  operator: string;
  from: string;
  to: string;
  date: string;
  departure: string;
  arrival: string;
  duration: string;
  seats: number[];
  passenger: PassengerDetails;
  accountEmail?: string;
  baseFare: number;
  bookingFee: number;
  total: number;
  status: "pending" | "paid" | "cancelled" | "failed";
  createdAt: string;
  paidAt?: string;
};

const BOOKINGS_KEY = "shiloh_transit_bookings";

export function readBookings(): StoredBooking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(BOOKINGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredBooking[]) : [];
  } catch {
    return [];
  }
}

export function writeBookings(bookings: StoredBooking[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

export function saveBooking(booking: StoredBooking) {
  const bookings = readBookings().filter((b) => b.ref !== booking.ref);
  bookings.unshift(booking);
  writeBookings(bookings);
  return booking;
}

export function getStoredBooking(ref: string): StoredBooking | undefined {
  return readBookings().find((b) => b.ref === ref);
}

export function updateStoredBooking(
  ref: string,
  patch: Partial<StoredBooking>
): StoredBooking | undefined {
  const bookings = readBookings();
  const index = bookings.findIndex((b) => b.ref === ref);
  if (index === -1) return undefined;
  bookings[index] = { ...bookings[index], ...patch };
  writeBookings(bookings);
  return bookings[index];
}
