import { events, isScheduled, type PadelEvent } from "../../src/data/events";
import {
  confirmationEmail,
  notificationEmail,
  sendEmail,
  waitlistEmail,
} from "../_lib/email";
import { jsonResponse, type Env } from "../_lib/env";

interface RegistrationInput {
  eventSlug: string;
  name: string;
  email: string;
  phone: string;
  levelConfirmed: boolean;
}

interface RegistrationRecord {
  id: number;
  status: "confirmed" | "waitlist";
  position?: number;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const parsed = await parseRegistration(request);
  if (!parsed.ok) return jsonResponse({ error: parsed.error }, { status: 400 });
  const input = parsed.value;

  const event = events.find((e) => e.slug === input.eventSlug);
  if (!event) {
    return jsonResponse({ error: "Événement inconnu." }, { status: 404 });
  }
  if (!isRegistrationOpen(event)) {
    return jsonResponse(
      { error: "Les inscriptions ne sont pas ouvertes pour cet événement." },
      { status: 409 },
    );
  }

  const result = await registerPlayer(env.DB, input, event.capacity!);
  if (!result.ok) {
    return jsonResponse({ error: result.error }, { status: result.status });
  }

  const formattedDate = formatDate(event);
  const emailCtx = {
    name: input.name,
    eventTitle: event.title,
    formattedDate,
    venue: event.venue,
    cost: event.cost,
  };

  try {
    const playerMail =
      result.value.status === "confirmed"
        ? confirmationEmail(emailCtx)
        : waitlistEmail({ ...emailCtx, position: result.value.position! });
    await sendEmail(env, {
      to: input.email,
      subject: playerMail.subject,
      html: playerMail.html,
      replyTo: env.NOTIFY_EMAIL,
    });
    const adminMail = notificationEmail({
      eventTitle: event.title,
      name: input.name,
      email: input.email,
      phone: input.phone,
      status: result.value.status,
      position: result.value.position,
    });
    await sendEmail(env, {
      to: env.NOTIFY_EMAIL,
      subject: adminMail.subject,
      html: adminMail.html,
      // So hitting "Reply" in Michael's inbox goes straight to the registrant.
      replyTo: input.email,
    });
  } catch (err) {
    // Email failure shouldn't roll back the registration — log it and continue.
    console.error("Email send failed", err);
  }

  return jsonResponse({
    status: result.value.status,
    position: result.value.position,
  });
};

async function parseRegistration(
  request: Request,
): Promise<{ ok: true; value: RegistrationInput } | { ok: false; error: string }> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return { ok: false, error: "JSON invalide." };
  }
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, error: "Corps de requête invalide." };
  }
  const r = raw as Record<string, unknown>;
  const name = typeof r.name === "string" ? r.name.trim() : "";
  const email = typeof r.email === "string" ? r.email.trim() : "";
  const phone = typeof r.phone === "string" ? r.phone.trim() : "";
  const levelConfirmed = r.levelConfirmed === true;
  const eventSlug = typeof r.eventSlug === "string" ? r.eventSlug.trim() : "";

  if (!name || name.length > 100) return { ok: false, error: "Nom requis (max 100 caractères)." };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { ok: false, error: "Adresse email invalide." };
  if (!phone || phone.length > 30) return { ok: false, error: "Numéro de téléphone requis." };
  if (!levelConfirmed) {
    return {
      ok: false,
      error: "Merci de confirmer que tu as déjà joué au moins 15 matchs de padel.",
    };
  }
  if (!eventSlug) return { ok: false, error: "Slug d'événement manquant." };

  return { ok: true, value: { name, email, phone, levelConfirmed, eventSlug } };
}

function isRegistrationOpen(event: PadelEvent): event is PadelEvent & {
  startDate: string;
  endDate: string;
  capacity: number;
} {
  if (!isScheduled(event)) return false;
  if (typeof event.capacity !== "number" || event.capacity <= 0) return false;
  if (new Date(event.startDate) < new Date()) return false;
  return true;
}

async function registerPlayer(
  db: D1Database,
  input: RegistrationInput,
  capacity: number,
): Promise<
  | { ok: true; value: RegistrationRecord }
  | { ok: false; status: number; error: string }
> {
  // Check existing registration (case-insensitive on email) to give a friendly
  // error rather than a unique-index failure.
  const existing = await db
    .prepare(
      "SELECT id, status FROM registrations WHERE event_slug = ? AND LOWER(email) = LOWER(?) AND status != 'cancelled' LIMIT 1",
    )
    .bind(input.eventSlug, input.email)
    .first<{ id: number; status: "confirmed" | "waitlist" }>();
  if (existing) {
    return {
      ok: false,
      status: 409,
      error:
        existing.status === "confirmed"
          ? "Tu es déjà inscrit(e) à cet événement."
          : "Tu es déjà sur la liste d'attente pour cet événement.",
    };
  }

  const confirmedCount = await countByStatus(db, input.eventSlug, "confirmed");
  const isFull = confirmedCount >= capacity;
  const status: "confirmed" | "waitlist" = isFull ? "waitlist" : "confirmed";

  const insert = await db
    .prepare(
      "INSERT INTO registrations (event_slug, name, email, phone, level_confirmed, status) VALUES (?, ?, ?, ?, 1, ?) RETURNING id",
    )
    .bind(input.eventSlug, input.name, input.email, input.phone, status)
    .first<{ id: number }>();

  if (!insert) {
    return { ok: false, status: 500, error: "Erreur lors de l'enregistrement." };
  }

  let position: number | undefined;
  if (status === "waitlist") {
    position = (await countByStatus(db, input.eventSlug, "waitlist")) || 1;
  }

  return { ok: true, value: { id: insert.id, status, position } };
}

async function countByStatus(
  db: D1Database,
  eventSlug: string,
  status: "confirmed" | "waitlist",
): Promise<number> {
  const row = await db
    .prepare(
      "SELECT COUNT(*) AS n FROM registrations WHERE event_slug = ? AND status = ?",
    )
    .bind(eventSlug, status)
    .first<{ n: number }>();
  return row?.n ?? 0;
}

function formatDate(event: PadelEvent & { startDate: string; endDate: string }): string {
  const dateFmt = new Intl.DateTimeFormat("fr-BE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeFmt = new Intl.DateTimeFormat("fr-BE", { hour: "2-digit", minute: "2-digit" });
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  return `${dateFmt.format(start)}, de ${timeFmt.format(start)} à ${timeFmt.format(end)}`;
}
