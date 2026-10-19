import { NextResponse } from "next/server";
import { z } from "zod";
import { filterRoutes } from "@/lib/data";

const schema = z.object({
  from: z.string().min(1, "Departure city is required"),
  to: z.string().min(1, "Arrival city is required"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be formatted as YYYY-MM-DD"),
  passengers: z.coerce.number().int().min(1).max(10),
});

/**
 * POST /api/routes/search
 * Accepts from, to, date and passengers and returns mock route results.
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
  const { from, to, date, passengers } = parsed.data;
  const results = filterRoutes({ from, to })
    .filter((route) => route.seatsAvailable >= passengers)
    .map((route) => ({
      id: route.id,
      from: route.from,
      to: route.to,
      operator: route.operator,
      coach: route.coach,
      departure: route.departure,
      arrival: route.arrival,
      duration: route.duration,
      durationMinutes: route.durationMinutes,
      seatsAvailable: route.seatsAvailable,
      baseFare: route.baseFare,
      fareMax: route.fareMax,
      date,
      passengers,
    }));

  return NextResponse.json({
    from,
    to,
    date,
    passengers,
    count: results.length,
    results,
  });
}
