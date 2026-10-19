import Link from "next/link";
import {
  Search,
  Armchair,
  CreditCard,
  Users,
  Ticket,
  BadgeCheck,
  MessageCircle,
  Quote,
} from "lucide-react";
import Hero from "@/components/Hero";
import PopularRoutes from "@/components/PopularRoutes";
import Reveal from "@/components/Reveal";
import {
  HOW_IT_WORKS,
  OPERATORS,
  TESTIMONIALS,
  WHY_SHILOH,
} from "@/lib/data";

const ICONS = {
  search: Search,
  armchair: Armchair,
  "credit-card": CreditCard,
  users: Users,
  ticket: Ticket,
  "badge-check": BadgeCheck,
  "message-circle": MessageCircle,
} as const;

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Popular routes */}
      <section className="section__container destination__container" id="about">
        <h2 className="section__header">Popular routes</h2>
        <p className="section__description">
          Kenya&apos;s most travelled corridors, with daily departures and live
          seat availability
        </p>
        <PopularRoutes />
      </section>

      {/* How it works */}
      <section className="section__container journey__container" id="tour">
        <h2 className="section__header">How it works</h2>
        <p className="section__description">
          Three simple steps from search to boarding
        </p>
        <div className="journey__grid">
          {HOW_IT_WORKS.map((step, index) => {
            const Icon = ICONS[step.icon];
            return (
              <Reveal key={step.title} delay={index * 0.1}>
                <div className="journey__card">
                  <div className="journey__card__bg">
                    <span>
                      <Icon size={28} />
                    </span>
                    <h4>
                      {index + 1}. {step.title}
                    </h4>
                  </div>
                  <div className="journey__card__content">
                    <span>
                      <Icon size={24} />
                    </span>
                    <h4>
                      {index + 1}. {step.title}
                    </h4>
                    <p className="text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Stats band reproduced from the template banner */}
      <section className="section__container banner__container">
        <div className="banner__card">
          <h4>10+</h4>
          <p>Routes across Kenya</p>
        </div>
        <div className="banner__card">
          <h4>3</h4>
          <p>Trusted operators</p>
        </div>
        <div className="banner__card">
          <h4>24/7</h4>
          <p>WhatsApp support</p>
        </div>
      </section>

      {/* Why Shiloh Transit */}
      <section className="section__container discover__container">
        <h2 className="section__header">Why Shiloh Transit</h2>
        <p className="section__description">
          Everything you need for a confident intercity trip
        </p>
        <div className="discover__grid discover__grid--four">
          {WHY_SHILOH.map((point, index) => {
            const Icon = ICONS[point.icon];
            return (
              <Reveal key={point.title} delay={index * 0.08}>
                <div className="discover__card h-full">
                  <span>
                    <Icon size={26} />
                  </span>
                  <h4>{point.title}</h4>
                  <p>{point.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Featured operators */}
      <section className="section__container" id="operators">
        <h2 className="section__header">Featured operators</h2>
        <p className="section__description">
          Vetted partners running every Shiloh Transit departure
        </p>
        <div className="marquee" style={{ marginTop: "3rem" }}>
          <div className="marquee__track">
            {[...OPERATORS, ...OPERATORS].map((operator, index) => (
              <div
                key={`${operator.name}-${index}`}
                className="mr-12 flex min-w-[280px] items-center gap-3 rounded-2xl border border-[#e5e7eb] bg-white px-6 py-4 shadow-[5px_5px_20px_rgba(0,0,0,0.08)]"
              >
                <span
                  className="grid h-12 w-12 place-items-center rounded-full font-bold text-white"
                  style={{ backgroundColor: operator.accent }}
                  aria-hidden="true"
                >
                  {operator.monogram}
                </span>
                <div>
                  <h4 className="text-lg font-semibold">{operator.name}</h4>
                  <p className="text-sm" style={{ color: "var(--text-light)" }}>
                    {operator.tagline}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section__container">
        <h2 className="section__header">Travellers love Shiloh Transit</h2>
        <p className="section__description">
          Real stories from riders across East Africa
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((item, index) => (
            <Reveal key={item.name} delay={index * 0.1}>
              <figure
                className="h-full rounded-2xl p-8 text-center"
                style={{
                  backgroundColor: "var(--extra-light)",
                  boxShadow: "5px 5px 20px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Quote
                  size={30}
                  className="mx-auto mb-4"
                  style={{ color: "var(--primary-color)" }}
                  aria-hidden="true"
                />
                <blockquote className="mb-4 leading-relaxed">
                  &quot;{item.quote}&quot;
                </blockquote>
                <figcaption>
                  <span className="font-semibold">{item.name}</span>,{" "}
                  <span style={{ color: "var(--text-light)" }}>{item.city}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Mobile app CTA */}
      <section className="section__container">
        <div
          className="grid items-center gap-8 rounded-3xl p-8 md:grid-cols-2 md:p-12"
          style={{ backgroundColor: "var(--extra-light)" }}
        >
          <div>
            <span className="chip">Coming soon</span>
            <h4
              className="mb-4 mt-4 text-3xl font-bold"
              style={{ color: "var(--text-dark)" }}
            >
              Take Shiloh Transit with you
            </h4>
            <p className="mb-6" style={{ color: "var(--text-light)" }}>
              Our mobile app is on the way. Search routes, book seats and keep
              your e-ticket in your pocket on every trip across Kenya.
            </p>
            <div className="flex flex-wrap gap-3">
              <span
                className="rounded-lg px-5 py-3 text-sm font-semibold text-white"
                style={{ backgroundColor: "var(--text-dark)" }}
              >
                Google Play (coming soon)
              </span>
              <span
                className="rounded-lg px-5 py-3 text-sm font-semibold"
                style={{
                  backgroundColor: "var(--white)",
                  color: "var(--text-dark)",
                  border: "1px solid var(--text-light)",
                }}
              >
                App Store (coming soon)
              </span>
            </div>
          </div>
          <div className="flex justify-center" aria-hidden="true">
            {/* Placeholder app graphic */}
            <svg width="220" height="420" viewBox="0 0 220 420" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="212" height="412" rx="32" fill="#0a0a0a" />
              <rect x="14" y="14" width="192" height="392" rx="24" fill="#ffffff" />
              <rect x="14" y="14" width="192" height="86" rx="24" fill="#2887ff" />
              <rect x="14" y="70" width="192" height="30" fill="#2887ff" />
              <text x="34" y="52" fill="#ffffff" fontSize="16" fontWeight="700" fontFamily="DM Sans, sans-serif">
                Shiloh Transit
              </text>
              <rect x="30" y="120" width="160" height="44" rx="8" fill="#f3f4f6" stroke="#d1d5db" />
              <text x="44" y="147" fill="#737373" fontSize="12" fontFamily="DM Sans, sans-serif">
                Nairobi to Mombasa
              </text>
              <rect x="30" y="176" width="160" height="44" rx="8" fill="#f3f4f6" stroke="#d1d5db" />
              <text x="44" y="203" fill="#737373" fontSize="12" fontFamily="DM Sans, sans-serif">
                Pick your seat
              </text>
              <rect x="30" y="248" width="74" height="52" rx="8" fill="#22c55e" />
              <rect x="114" y="248" width="74" height="52" rx="8" fill="#d1d5db" />
              <rect x="30" y="312" width="160" height="40" rx="20" fill="#2887ff" />
              <text x="66" y="337" fill="#ffffff" fontSize="13" fontWeight="700" fontFamily="DM Sans, sans-serif">
                Book now
              </text>
              <rect x="70" y="374" width="80" height="6" rx="3" fill="#d1d5db" />
            </svg>
          </div>
        </div>
      </section>
    </>
  );
}
