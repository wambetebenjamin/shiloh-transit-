"use client";

import Link from "next/link";
import { POPULAR_ROUTES } from "@/lib/data";
import { formatKES } from "@/lib/utils";
import Reveal from "./Reveal";

const ROUTE_IMAGES: Record<string, string> = {
  "nairobi-mombasa": "/images/route-nairobi-mombasa.jpg",
  "nairobi-kisumu": "/images/route-nairobi-kisumu.jpg",
  "nairobi-nakuru": "/images/route-nairobi-nakuru.jpg",
  "nairobi-eldoret": "/images/route-nairobi-eldoret.jpg",
  "mombasa-malindi": "/images/route-mombasa-malindi.jpg",
};

/** Popular routes grid with fade up entrance animations. */
export default function PopularRoutes() {
  return (
    <div className="destination__grid">
      {POPULAR_ROUTES.map((route, index) => (
        <Reveal key={route.id} delay={index * 0.08}>
          <article className="destination__card">
            <img
              src={ROUTE_IMAGES[route.id] ?? "/img/background6.jpg"}
              alt={`${route.from} to ${route.to} route`}
              className="aspect-[16/10] object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = "/img/background6.jpg";
              }}
            />
            <div className="destination__card__details">
              <div>
                <h4>
                  {route.from} to {route.to}
                </h4>
                <p>
                  Fare {formatKES(route.baseFare)} to {formatKES(route.fareMax)}
                </p>
              </div>
              <div className="destination__ratings">{route.duration}</div>
            </div>
            <div style={{ padding: "0 1rem 1.25rem" }}>
              <Link href={`/routes/${route.id}`} className="btn">
                Book Now
              </Link>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
