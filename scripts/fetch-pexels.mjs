/**
 * Build time image fetching for Shiloh Transit.
 *
 * Downloads every image used by the site from the Pexels API into
 * /public/images when PEXELS_API_KEY is configured. When the key or
 * the network is unavailable (local builds without credentials) the
 * script skips quietly and exits 0 so `npm run build` never fails.
 *
 * Usage: node scripts/fetch-pexels.mjs
 */

import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const API_KEY = process.env.PEXELS_API_KEY || "";
const OUT_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "images"
);

const IMAGES = [
  { file: "hero-bus.jpg", query: "bus Kenya highway", orientation: "portrait" },
  { file: "matatu.jpg", query: "matatu Nairobi", orientation: "landscape" },
  {
    file: "route-nairobi-mombasa.jpg",
    query: "Mombasa Kenya bus",
    orientation: "landscape",
  },
  {
    file: "route-mombasa-malindi.jpg",
    query: "Malindi Kenya beach",
    orientation: "landscape",
  },
  {
    file: "route-nairobi-nakuru.jpg",
    query: "Nakuru Kenya highway",
    orientation: "landscape",
  },
  {
    file: "route-nairobi-kisumu.jpg",
    query: "East African traveller bus",
    orientation: "landscape",
  },
  {
    file: "route-nairobi-eldoret.jpg",
    query: "passenger boarding bus Africa",
    orientation: "landscape",
  },
];

async function main() {
  if (!API_KEY) {
    console.log("[fetch-pexels] PEXELS_API_KEY not set, skipping image fetch.");
    return;
  }
  await mkdir(OUT_DIR, { recursive: true });
  for (const item of IMAGES) {
    try {
      const url = new URL("https://api.pexels.com/v1/search");
      url.searchParams.set("query", item.query);
      url.searchParams.set("per_page", "1");
      if (item.orientation) url.searchParams.set("orientation", item.orientation);
      const res = await fetch(url, { headers: { Authorization: API_KEY } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const photo = data?.photos?.[0];
      if (!photo) throw new Error("no results");
      const imgRes = await fetch(photo.src.large2x || photo.src.original);
      if (!imgRes.ok) throw new Error(`image HTTP ${imgRes.status}`);
      const buffer = Buffer.from(await imgRes.arrayBuffer());
      await writeFile(path.join(OUT_DIR, item.file), buffer);
      console.log(
        `[fetch-pexels] ${item.file} <= ${photo.url} by ${photo.photographer}`
      );
    } catch (error) {
      console.warn(
        `[fetch-pexels] could not fetch ${item.file}: ${error.message}. Keeping existing copy.`
      );
    }
  }
}

main().catch((error) => {
  console.warn("[fetch-pexels] skipped:", error.message);
  process.exit(0);
});
