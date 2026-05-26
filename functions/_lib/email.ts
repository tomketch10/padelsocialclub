import type { Env } from "./env";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  bcc?: string;
}

export async function sendEmail(env: Env, params: SendEmailParams): Promise<void> {
  if (!env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set, skipping email", params.subject);
    return;
  }
  const body: Record<string, unknown> = {
    from: env.RESEND_FROM,
    to: [params.to],
    subject: params.subject,
    html: params.html,
  };
  if (params.replyTo) body.reply_to = params.replyTo;
  if (params.bcc) body.bcc = [params.bcc];

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend send failed (${response.status}): ${detail}`);
  }
}

interface EmailContext {
  name: string;
  eventTitle: string;
  formattedDate: string;
  venue: string;
  cost: string;
}

const SIGNATURE = `<p style="margin-top:24px">À très vite,<br>Michael<br><em>Padel Social Club</em></p>`;
const WHATSAPP_NOTE = `<p>Je t'ajoute au <strong>groupe WhatsApp du Padel Social Club</strong> pour les infos pratiques avant le tournoi.</p>`;

export function confirmationEmail(ctx: EmailContext): { subject: string; html: string } {
  return {
    subject: `Inscription confirmée pour ${ctx.eventTitle}`,
    html: `
<p>Salut ${escapeHtml(ctx.name)},</p>
<p>Top, ta place pour <strong>${escapeHtml(ctx.eventTitle)}</strong> est <strong>confirmée</strong> ! 🎾</p>
<p><strong>Quand</strong> : ${escapeHtml(ctx.formattedDate)}<br>
<strong>Où</strong> : ${escapeHtml(ctx.venue)}<br>
<strong>Prix</strong> : ${escapeHtml(ctx.cost)}, à payer sur place (cash ou Bancontact)</p>
<p>Le programme : format <strong>Paradis / Enfer</strong>, en individuel, dans la bonne humeur.
Les boissons d'après match sont incluses.</p>
${WHATSAPP_NOTE}
<p>Si tu ne peux finalement plus venir, préviens-moi le plus tôt possible. Quelqu'un sur la liste d'attente sera ravi de prendre ta place.</p>
${SIGNATURE}`.trim(),
  };
}

export function waitlistEmail(
  ctx: EmailContext & { position: number },
): { subject: string; html: string } {
  return {
    subject: `Liste d'attente pour ${ctx.eventTitle}`,
    html: `
<p>Salut ${escapeHtml(ctx.name)},</p>
<p>Merci pour ton inscription à <strong>${escapeHtml(ctx.eventTitle)}</strong> !</p>
<p>Le tournoi est <strong>complet</strong>, mais je t'ai ajouté(e) en <strong>liste d'attente (position ${ctx.position})</strong>.</p>
<p>Si une place se libère, je te préviens immédiatement par email. ${escapeHtml(ctx.eventTitle)} a lieu le ${escapeHtml(ctx.formattedDate)} au ${escapeHtml(ctx.venue)}.</p>
<p>Croise les doigts ! En attendant, suis-nous sur Instagram <a href="https://www.instagram.com/padelsocial_club">@padelsocial_club</a> pour ne pas rater les prochaines éditions.</p>
${SIGNATURE}`.trim(),
  };
}

export function promotedEmail(ctx: EmailContext): { subject: string; html: string } {
  return {
    subject: `Bonne nouvelle, ta place est confirmée pour ${ctx.eventTitle} !`,
    html: `
<p>Salut ${escapeHtml(ctx.name)},</p>
<p>Une place s'est libérée et ta place pour <strong>${escapeHtml(ctx.eventTitle)}</strong> est maintenant <strong>confirmée</strong> ! 🎾</p>
<p><strong>Quand</strong> : ${escapeHtml(ctx.formattedDate)}<br>
<strong>Où</strong> : ${escapeHtml(ctx.venue)}<br>
<strong>Prix</strong> : ${escapeHtml(ctx.cost)}, à payer sur place (cash ou Bancontact)</p>
${WHATSAPP_NOTE}
<p>Si tu n'es plus disponible, dis-le-moi tout de suite pour qu'on puisse proposer la place à la personne suivante.</p>
${SIGNATURE}`.trim(),
  };
}

export function notificationEmail(registration: {
  eventTitle: string;
  name: string;
  email: string;
  phone: string;
  status: "confirmed" | "waitlist";
  position?: number;
}): { subject: string; html: string } {
  const statusLabel =
    registration.status === "confirmed" ? "Confirmé" : `Liste d'attente (#${registration.position})`;
  return {
    subject: `[PSC] Nouvelle inscription : ${registration.name} (${statusLabel})`,
    html: `
<p><strong>Événement</strong> : ${escapeHtml(registration.eventTitle)}</p>
<p><strong>Nom</strong> : ${escapeHtml(registration.name)}<br>
<strong>Email</strong> : ${escapeHtml(registration.email)}<br>
<strong>Téléphone</strong> : ${escapeHtml(registration.phone)}<br>
<strong>Statut</strong> : ${escapeHtml(statusLabel)}</p>`.trim(),
  };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
