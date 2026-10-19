import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getBookingRecord } from "@/lib/kv";

/**
 * GET /api/bookings/[ref]
 * Returns booking detail for a reference. Session-gated: callers must
 * be signed in.
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ ref: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { error: "Sign in required to view a booking" },
      { status: 401 }
    );
  }
  const { ref } = await ctx.params;
  const booking = await getBookingRecord(ref.toUpperCase());
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
  return NextResponse.json({ booking });
}
