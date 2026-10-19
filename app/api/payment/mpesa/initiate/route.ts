import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { formatKES, isValidKenyanPhone, normalizePhone } from "@/lib/utils";
import { getBookingRecord, updateBookingRecord } from "@/lib/kv";

const schema = z.object({
  phone: z.string().min(9, "Phone number is required"),
  amount: z.number().int().positive("Amount must be positive"),
  ref: z.string().optional(),
});

/**
 * POST /api/payment/mpesa/initiate
 * Simulates an M-Pesa STK push: validates the phone number and amount
 * and returns the Daraja style acknowledgement payload.
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
  const { phone, amount, ref } = parsed.data;
  if (!isValidKenyanPhone(phone)) {
    return NextResponse.json(
      { error: "Enter a valid Kenyan mobile number, for example 0712345678" },
      { status: 400 }
    );
  }

  if (ref) {
    const existing = await getBookingRecord(ref.toUpperCase());
    if (!existing) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    await updateBookingRecord(ref.toUpperCase(), { status: "pending" });
  }

  const merchantRequestId = `MR-${randomUUID().split("-")[0].toUpperCase()}`;
  const checkoutRequestId = `ws_CO_${Date.now()}-${randomUUID().split("-")[0]}`;

  return NextResponse.json({
    MerchantRequestID: merchantRequestId,
    CheckoutRequestID: checkoutRequestId,
    ResponseCode: "0",
    ResponseDescription: "Success. Request accepted for processing.",
    CustomerMessage: `Enter your M-PESA PIN on your phone to pay ${formatKES(
      amount
    )} to SHILOH TRANSIT. The prompt is on ${normalizePhone(phone)}.`,
    simulates: true,
  });
}
