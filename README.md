# Padel Social Club

Static website for **padelsocialclub.be**, replacing the previous WordPress install.

## Stack

- **Vite** + **React 18** + **TypeScript** (matches the etfguide.be stack)
- **Tailwind CSS** + a small slice of **shadcn-ui** primitives
- Designed to deploy on **Cloudflare Pages** (free tier — `npm run build` outputs to `dist/`)

The dependency footprint is intentionally trimmed compared to etfguide. Add shadcn components with `npx shadcn@latest add <name>` as you need them.

## Local development

```bash
npm install
npm run dev      # http://localhost:8080
```

## Build

```bash
npm run build    # outputs to dist/
npm run preview  # serves the production build locally
```

## Project structure

```
src/
├── App.tsx                 ← router setup
├── main.tsx
├── index.css               ← Tailwind base + brand CSS variables
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ui/button.tsx       ← shadcn Button (only primitive needed so far)
├── data/
│   └── events.ts           ← edit here to update tournament list
├── lib/
│   └── utils.ts            ← shadcn cn() helper
└── pages/
    ├── Home.tsx
    └── NotFound.tsx

public/
├── logo.png
├── favicon.png
├── robots.txt
└── _redirects              ← SPA fallback for Cloudflare Pages

wordpress-export/           ← snapshot of the old WP site (content + images + brand)
```

## Brand

Extracted from the old WordPress site (see `wordpress-export/assets/BRAND.md`):

- Primary `#A63C24` (brick red)
- Secondary `#D9A334` (gold)
- Background `#FBF3E2` (cream)
- Fonts: Oswald (display), Poppins (body), Yanone Kaffeesatz (accent) — all Google Fonts

## Adding a tournament

1. Open `src/data/events.ts`
2. Add a new entry at the top of the `events` array (most recent first)
3. Push to git — Cloudflare Pages will auto-deploy

`getNextEvent()` automatically picks the soonest upcoming event for the homepage hero card.

## Deploy to Cloudflare Pages

1. Create a new Pages project in the Cloudflare dashboard
2. Connect this GitHub repo
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Set custom domain: `padelsocialclub.be`

## What's not in here yet

- **Créez votre Event** page (currently routes to 404 — content was barely populated on WP, needs a copy decision)
- **Cookies** / **Politique de confidentialité** pages — content exported in `wordpress-export/pages/`, ready to port
- **Agenda** page listing all past + upcoming events
- **Online registration** — currently links out to the old WP site. To make it native: add a Cloudflare Worker + D1 database, or wire up Tally / Google Forms.
