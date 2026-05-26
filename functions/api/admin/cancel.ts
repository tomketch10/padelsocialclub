import { events } from "../../../src/data/events";
import { checkAdminAuth, unauthorized } from "../../_lib/auth";
import { promotedEmail, sendEmail } from "../../_lib/email";
import { jsonResponse, type Env } from "../../_lib/env";

interface Body {
  registrationId: number;
}

interface Row {
  id: number;
  event_slug: string;
  name: string;
  email: string;
  status: "confirmed" | "waitlist" | "cancelled";
}

/**
 * Cancels a registration and, if the cancelled spot was a confirmed one,
 * promotes the first person on the waitlist (FIFO) and emails them.
 */
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!checkAdminAuth(request, env.ADMIN_PASSWORD)) return unauthorized();

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return jsonResponse({ error: "JSON invalide." }, { status: 400 });
  }
  if (typeof body?.registrationId !== "number") {
    return jsonResponse({ error: "registrationId requis." }, { status: 400 });
  }

  const target = await env.DB.prepare(
    "SELECT id, event_slug, name, email, status FROM registrations WHERE id = ?",
  )
    .bind(body.registrationId)
    .first<Row>();
  if (!target) {
    return jsonResponse({ error: "Inscription introuvable." }, { status: 404 });
  }
  if (target.status === "cancelled") {
    return jsonResponse({ error: "Déjà annulée." }, { status: 409 });
  }

  await env.DB.prepare(
    "UPDATE registrations SET status = 'cancelled', cancelled_at = datetime('now') WHERE id = ?",
  )
    .bind(target.id)
    .run();

  let promoted: Row | null = null;
  if (target.status === "confirmed") {
    promoted = await promoteFromWaitlist(env, target.event_slug);
  }

  return jsonResponse({ cancelled: target.id, promoted: promoted?.id ?? null });
};

async function promoteFromWaitlist(env: Env, eventSlug: string): Promise<Row | null> {
  const next = await env.DB.prepare(
    "SELECT id, event_slug, name, email, status FROM registrations WHERE event_slug = ? AND status = 'waitlist' ORDER BY created_at ASC LIMIT 1",
  )
    .bind(eventSlug)
    .first<Row>();
  if (!next) return null;

  await env.DB.prepare("UPDATE registrations SET status = 'confirmed' WHERE id = ?")
    .bind(next.id)
    .run();

  const event = events.find((e) => e.slug === eventSlug);
  if (event && event.startDate && event.endDate) {
    try {
      const dateFmt = new Intl.DateTimeFormat("fr-BE", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const timeFmt = new Intl.DateTimeFormat("fr-BE", { hour: "2-digit", minute: "2-digit" });
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      const mail = promotedEmail({
        name: next.name,
        eventTitle: event.title,
        formattedDate: `${dateFmt.format(start)}, de ${timeFmt.format(start)} à ${timeFmt.format(end)}`,
        venue: event.venue,
        cost: event.cost,
      });
      await sendEmail(env, {
        to: next.email,
        subject: mail.subject,
        html: mail.html,
        replyTo: env.NOTIFY_EMAIL,
      });
    } catch (err) {
      console.error("Failed to email promoted player", err);
    }
  }

  return { ...next, status: "confirmed" };
}
