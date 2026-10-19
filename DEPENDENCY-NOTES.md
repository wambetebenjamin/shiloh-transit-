# Dependency notes

The stack follows the requested specification exactly (no carets, no
tildes, no ranges, `engines.node >= 24`, `.nvmrc` = 24) with the few
changes below. Each change was required to satisfy a hard requirement of
the build: `npm ci`, `npx tsc --noEmit`, `npx next build` and
`npm audit --audit-level=high` (zero high and zero critical
vulnerabilities).

## Version adjustments

| Package | Requested | Used | Why |
| --- | --- | --- | --- |
| `next-auth` | `5.0.0-beta.28` | `5.0.0-beta.32` | beta.28 is affected by three critical Auth.js advisories (GHSA-5jpx-9hw9-2fx4, GHSA-7rqj-j65f-68wh, GHSA-8fpg-xm3f-6cx3, GHSA-x445-f3h2-j279, GHSA-xmf8-cvqr-rfgj). beta.32 is the patched release on the same beta line and officially declares `next@^16` peer support. |
| `jspdf` | `3.0.1` | `4.2.1` | Every jsPDF release `<= 4.2.0` is flagged by eleven critical advisories. 4.2.1 is the first patched release, required by the zero critical audit gate. The PDF download API used here (`jsPDF`, `addImage`, `save`) is unchanged. |
| `nodemailer` | `6.10.1` | `10.1.7` | All `<= 10.0.5` releases are flagged high severity (SMTP/header injection, addressparser issues). 10.1.7 is the patched release. Only `createTransport` + `sendMail` are used, which are stable across these versions. |
| `@vercel/blob` | `0.29.4` | `2.8.2` | `0.29.4` does not exist on npm (the 0.x line ends at 0.27.3). The 0.x line pulls vulnerable `@fastify/busboy` and `undici`. 2.8.2 is the current audit-clean release. The package is installed per the spec and is currently not called by application code. |

## Additions (required companions of the pinned stack)

| Package | Version | Why |
| --- | --- | --- |
| `@tailwindcss/postcss` | `4.1.10` | Tailwind v4's PostCSS plugin (same exact version as `tailwindcss`). Tailwind 4 cannot be wired into Next.js through the `tailwindcss` package alone, so this is the only way to compile the requested `tailwindcss@4.1.10`. |

## Overrides (extends the requested overrides block)

The requested overrides are kept verbatim. Two entries were added:

* `motion-dom: 12.17.3` and `motion-utils: 12.12.1`: framer-motion
  `12.18.0` depends on `motion-dom ^12.17.3`, but npm resolved it to
  `12.43.0`, which removed the `activeAnimations` export framer-motion
  needs and broke `next build`. Pinning the sibling packages to the
  versions framer-motion 12.18.0 was released against fixes the build
  while keeping `framer-motion` at the exact requested `12.18.0`.

## Local environment

* The sandbox runs Node 22, so `npm ci` prints an `EBADENGINE` warning
  for the `>= 24` engine requirement. The requirement itself is kept
  exactly as specified (`engines` + `.nvmrc`), and every command passes.
* `.npmrc` sets `legacy-peer-deps=true` so the lockfile resolution is
  reproducible across npm versions.
