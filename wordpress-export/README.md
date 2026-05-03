# WordPress export — padelsocialclub.be

Snapshot of the live WordPress site captured on **2026-05-03**, before migrating to a static Cloudflare Pages site.

Source: https://padelsocialclub.be (WordPress + Elementor Pro + The Events Calendar)

## What's in here

```
wordpress-export/
├── README.md            ← this file
├── INDEX.json           ← machine-readable list of all pages and events
├── pages/               ← 7 WordPress pages, one HTML file each with YAML-ish frontmatter
├── events/              ← 8 tournament events (PSC episodes 1-9, except #6)
├── html/                ← rendered HTML of every public page (visual reference)
├── images/              ← 120 media files (~20 MB), preserving the WP /YYYY/MM/ folder layout
│   └── MANIFEST.json    ← full media metadata (alt text, captions, dimensions)
├── assets/
│   └── BRAND.md         ← extracted colors, fonts, logo info
└── raw-json/            ← original WP-JSON & sitemap responses (source of truth)
```

## Contents summary

### Pages (7)

| Slug                          | Title                              |
|-------------------------------|------------------------------------|
| `accueil`                     | Accueil (homepage)                 |
| `creez-votre-event`           | Créez votre Event                  |
| `event`                       | Agenda                             |
| `tickets-checkout`            | Commande de billets                |
| `tickets-order`               | Commande terminée                  |
| `cookies`                     | Cookies                            |
| `politique-de-confidentialite`| Politique de confidentialité       |

### Events (8 tournaments)

| Slug                            | Date                | Cost  |
|---------------------------------|---------------------|-------|
| `psc-episode-1`                 | 2025-05-24 13:30    |       |
| `psc-episode-2`                 | 2025-06-07 13:30    |       |
| `psc-episode-3`                 | 2025-07-05 13:30    |       |
| `psc-4`                         | 2025-08-02 13:30    |       |
| `padel-social-club-5`           | 2025-09-17 18:30    |       |
| `le-padel-social-club-7`        | 2026-01-21 18:30    |       |
| `padel-social-club-edition-8`   | 2026-03-11 18:30    |       |
| `le-padel-social-club-9`        | 2026-04-24 18:30    |       |

(There is no PSC #6 in the sitemap — either skipped or unpublished.)

## How to use this snapshot

- For **rebuilding pages**, work from `pages/*.html` (clean WP content) and refer to `html/*.html` if you need to see how it was rendered (Elementor markup is in there but is messy).
- For **the events list**, work from `events/*.html` — frontmatter has structured date/venue/cost.
- For **images**, check `images/MANIFEST.json` to find by alt text or original filename, then load the file from `images/YYYY/MM/`.
- For **brand styling**, see `assets/BRAND.md`.
- Re-run the export by re-fetching from the URLs in `raw-json/page-sitemap.xml` and `raw-json/tribe_events-sitemap.xml`.

## Caveats

- This export captures **content only**. The Elementor visual layout is not preserved in a useful way — it gets rebuilt from scratch in the new site.
- Customer/order data (`tickets-order`, `tickets-checkout` pages render dynamically per-customer) is **not** in here. Past order records would need to be exported separately from the WP admin if they matter.
- Sponsor logos, partner badges, etc. are inside `images/` but not catalogued by purpose — they'll need to be reviewed manually when rebuilding the homepage.
