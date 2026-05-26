import { checkAdminAuth, unauthorized } from "../../_lib/auth";
import { jsonResponse, type Env } from "../../_lib/env";

interface Row {
  id: number;
  event_slug: string;
  name: string;
  email: string;
  phone: string;
  status: "confirmed" | "waitlist" | "cancelled";
  created_at: string;
  cancelled_at: string | null;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!checkAdminAuth(request, env.ADMIN_PASSWORD)) return unauthorized();

  const { results } = await env.DB.prepare(
    "SELECT id, event_slug, name, email, phone, status, created_at, cancelled_at FROM registrations ORDER BY event_slug, status, created_at",
  ).all<Row>();

  // Group by event_slug for the admin UI's convenience.
  const byEvent: Record<string, Row[]> = {};
  for (const row of results) {
    (byEvent[row.event_slug] ??= []).push(row);
  }
  return jsonResponse({ registrations: results, byEvent });
};
