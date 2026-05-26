import { events } from "../../src/data/events";
import { jsonResponse, type Env } from "../_lib/env";

/**
 * Public per-event status: how many confirmed signups so far and whether the
 * event is full. Used by the homepage to show a 'waitlist only' banner before
 * the user submits the registration form.
 */
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");
  if (!slug) return jsonResponse({ error: "slug requis." }, { status: 400 });

  const event = events.find((e) => e.slug === slug);
  if (!event) return jsonResponse({ error: "Événement inconnu." }, { status: 404 });
  if (typeof event.capacity !== "number") {
    return jsonResponse(
      { slug, capacity: null, confirmed: 0, full: false, accepting: false },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const row = await env.DB
    .prepare(
      "SELECT COUNT(*) AS n FROM registrations WHERE event_slug = ? AND status = 'confirmed'",
    )
    .bind(slug)
    .first<{ n: number }>();
  const confirmed = row?.n ?? 0;
  return jsonResponse(
    {
      slug,
      capacity: event.capacity,
      confirmed,
      full: confirmed >= event.capacity,
      accepting: true,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
};
