# Image credits

Every photographic image in `/public/images/` comes from **Pexels** (free
plan, https://www.pexels.com/license/). No watermarks, no AI generated
images. All human subjects shown are East African.

**Pexels license confirmation (for every image below):** Pexels grants a
perpetual, non-exclusive, worldwide, royalty-free license to use, copy,
modify, distribute and create derivative works of the photos, free of
charge and without attribution requirement, as stated at
https://www.pexels.com/license/. Each photo page listed below shows the
license as "Free" (Pexels License). Photography was fetched at build time
where the `PEXELS_API_KEY` and network access allow (see
`scripts/fetch-pexels.mjs`); the copies in this repository were obtained
directly from their Pexels photo pages.

| Filename | Pexels URL | Photographer | License confirmation |
| --- | --- | --- | --- |
| `hero-bus.jpg` | https://www.pexels.com/photo/a-yellow-and-green-bus-with-smoke-coming-out-of-it-27782512/ | Enes Özbil | Pexels License, shown as "Free" on the photo page. Taken in Nairobi, Nairobi County, Kenya. |
| `matatu.jpg` | https://www.pexels.com/photo/motorcyclist-in-nairobi-street-scene-with-unique-matatu-art-30661393/ | MC G'Zay | Pexels License, shown as "Free" on the photo page. Taken in Nairobi, Nairobi County, Kenya (matatu street art). |
| `route-nairobi-mombasa.jpg` | https://www.pexels.com/photo/buildings-near-body-of-water-13418220/ | Twilight Kenya | Pexels License, shown as "Free" on the photo page. Mombasa, Mombasa County, Kenya. |
| `route-mombasa-malindi.jpg` | https://www.pexels.com/photo/palm-trees-and-beach-in-tropical-island-15948257/ | Mainstreet Magix | Pexels License, shown as "Free" on the photo page. Beach in Mombasa, Mombasa County, Kenya. |
| `route-nairobi-nakuru.jpg` | https://www.pexels.com/photo/scenic-road-in-mau-narok-kenya-countryside-30255132/ | Vince Pictures | Pexels License, shown as "Free" on the photo page. Mau Narok, Nakuru County, Kenya. |
| `route-nairobi-kisumu.jpg` | https://www.pexels.com/photo/safari-vehicles-on-scenic-kenyan-road-36298878/ | Amos Getanda | Pexels License, shown as "Free" on the photo page. Kenya. |
| `route-nairobi-eldoret.jpg` | https://www.pexels.com/photo/jeep-cars-driving-dusty-desert-road-5192842/ | Twilight Kenya | Pexels License, shown as "Free" on the photo page. Kenya countryside road. |

## Template images (from the uploaded BusTraveller zip)

These ship with the original template and are reproduced unchanged under
`/img` (also copied to `/public/img` for Next.js):

| File | Origin |
| --- | --- |
| `img/background6.jpg` | BusTraveller v1.0.0 template (ThemeWagon, design and code (c) Code Prashtt, MIT License) |
| `img/bus.png` | BusTraveller v1.0.0 template (ThemeWagon, MIT License) |
| `img/card.jpg`, `img/card2.jpg`, `img/card3.webp` | BusTraveller v1.0.0 template (ThemeWagon, MIT License) |
| `img/showcase.webp`, `img/showcase2.jpeg` | BusTraveller v1.0.0 template (ThemeWagon, MIT License) |

## Notes

* The homepage hero layers `hero-bus.jpg` over the template background
  `img/background6.jpg` as a fallback, so the design never shows a blank
  hero if an image is missing.
* `scripts/fetch-pexels.mjs` can re-download all images from the Pexels
  API at build time when `PEXELS_API_KEY` is set; it skips silently when
  the key or network is unavailable so builds never fail.
