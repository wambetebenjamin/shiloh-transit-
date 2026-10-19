import { NextResponse } from "next/server";
import { z } from "zod";
import { updateBookingRecord } from "@/lib/kv";

const schema = z.object({
  ref: z.string().min(4),
  status: z.enum(["paid", "failed", "cancelled"]),
  MerchantRequestID: z.string().optional(),
  CheckoutRequestID: z.string().optional(),
  ResultCode: z.number().optional(),
});

/**
 * POST /api/payment/mpesa/callback
 * Receives a payment confirmation (simulated Daraja callback) and
 * updates the booking status.
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
  const { ref, status } = parsed.data;
  const updated = await updateBookingRecord(ref.toUpperCase(), {
    status,
    ...(status === "paid" ? { paidAt: new Date().toISOString() } : {}),
  });

  if (!updated) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, ref: updated.ref, status: updated.status });
}
