import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getRoute } from "@/lib/data";
import { addDaysISO, todayISO } from "@/lib/utils";
import RouteDetailClient from "@/components/RouteDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const route = getRoute(id);
  if (!route) return { title: "Route not found" };
  return {
    title: `${route.from} to ${route.to}`,
    description: `Book the ${route.operator} service from ${route.from} to ${route.to}. Pick your seat and pay with M-Pesa.`,
  };
}

export default async function RouteDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ date?: string; passengers?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const route = getRoute(id);
  if (!route) notFound();

  const date =
    sp.date && /^\d{4}-\d{2}-\d{2}$/.test(sp.date)
      ? sp.date
      : addDaysISO(todayISO(), 1);
  const passengers = Number(sp.passengers) || 1;

  return (
    <RouteDetailClient
      route={route}
      initialDate={date}
      passengers={passengers}
    />
  );
}
