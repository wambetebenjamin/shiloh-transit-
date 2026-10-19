"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "/", label: "HOME" },
  { href: "/routes", label: "ROUTES" },
  { href: "/my-bookings", label: "MY BOOKINGS" },
  { href: "/#contact", label: "CONTACT" },
];

/**
 * Navbar built on the template nav structure and classes, with a
 * Framer Motion slide-in drawer for the mobile menu.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav>
      <div className="nav__header">
        <div className="nav__logo">
          <Link href="/" className="logo">
            Shiloh Transit
          </Link>
        </div>
        <button
          type="button"
          className="nav__menu__btn"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <motion.ul
        id="nav-links"
        className="nav__links"
        initial={false}
        animate={{ y: open ? "100%" : 0 }}
        transition={{ type: "tween", duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ transition: "none" }}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) setOpen(false);
        }}
      >
        {LINKS.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
        <li>
          <Link href="/auth/signin">SIGN IN</Link>
        </li>
        <li>
          <Link href="/routes">BOOK A SEAT</Link>
        </li>
      </motion.ul>

      <div className="nav__btns">
        <Link
          href="/auth/signin"
          className="mr-4 font-semibold"
          style={{ color: "var(--text-dark)" }}
        >
          Sign in
        </Link>
        <Link href="/routes" className="btn">
          BOOK A SEAT
        </Link>
      </div>
    </nav>
  );
}
