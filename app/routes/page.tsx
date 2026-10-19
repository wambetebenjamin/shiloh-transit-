import { Suspense } from "react";
import type { Metadata } from "next";
import RoutesExplorer from "@/components/RoutesExplorer";

export const metadata: Metadata = {
  title: "All Routes",
  description:
    "Filter intercity bus and matatu routes across Kenya by departure city, arrival city and date.",
};

export default function RoutesPage() {
  return (
    <Suspense
      fallback={
        <div className="section__container">
          <p style={{ color: "var(--text-light)" }}>Loading routes...</p>
        </div>
      }
    >
      <RoutesExplorer />
    </Suspense>
  );
}
