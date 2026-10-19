import Link from "next/link";
import type { ReactNode } from "react";

/** Single column legal document layout with brand header and footer. */
export default function LegalArticle({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="section__container" style={{ maxWidth: 820 }}>
      <header style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <Link href="/" className="logo">
          Shiloh Transit
        </Link>
        <h1
          className="mt-5 text-3xl font-bold md:text-4xl"
          style={{ color: "var(--text-dark)" }}
        >
          {title}
        </h1>
        <p className="mt-2" style={{ color: "var(--text-light)" }}>
          Last updated: {updated}
        </p>
      </header>
      <article className="legal-article">{children}</article>
    </div>
  );
}
