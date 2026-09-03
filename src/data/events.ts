/**
 * A tournament edition. `startDate`/`endDate` are omitted when the next edition
 * has been announced but not yet scheduled — the homepage renders this as
 * "date à confirmer".
 */
export interface PadelEvent {
  slug: string;
  title: string;
  startDate?: string;
  endDate?: string;
  cost: string;
  venue: string;
  /** Total number of player spots. Required for events that take registrations. */
  capacity?: number;
}

type ScheduledPadelEvent = PadelEvent & Required<Pick<PadelEvent, "startDate" | "endDate">>;

const REGISTRATION_EMAIL = "michael@i-management.be";

function isScheduled(event: PadelEvent): event is ScheduledPadelEvent {
  return !!event.startDate;
}

export function registrationMailto(event: PadelEvent): string {
  const subject = isScheduled(event)
    ? `Inscription — ${event.title}`
    : `Tenez-moi informé(e) du prochain tournoi`;
  const datePart = isScheduled(event) ? ` (${event.startDate.slice(0, 10)})` : "";
  const body = [
    `Bonjour Michael,`,
    ``,
    isScheduled(event)
      ? `Je souhaite m'inscrire à ${event.title}${datePart}.`
      : `Je souhaite être tenu(e) informé(e) du prochain tournoi (${event.title}).`,
    ``,
    `Nom :`,
    `Niveau (nombre de matchs joués) :`,
    `Téléphone :`,
    ``,
    `Merci !`,
  ].join("\n");
  return `mailto:${REGISTRATION_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Tournament list — newest first
export const events: PadelEvent[] = [
  {
    slug: "le-padel-social-club-11",
    title: "Le Padel Social Club #11",
    startDate: "2026-09-30T19:00:00",
    endDate: "2026-09-30T22:00:00",
    cost: "40€",
    venue: "Moko",
    capacity: 25,
  },
  {
    slug: "le-padel-social-club-10",
    title: "Le Padel Social Club #10",
    startDate: "2026-07-04T18:30:00",
    endDate: "2026-07-04T21:30:00",
    cost: "40€",
    venue: "Mokko Gastuche",
    capacity: 28,
  },
  {
    slug: "le-padel-social-club-9",
    title: "Le Padel Social Club #9",
    startDate: "2026-04-24T18:30:00",
    endDate: "2026-04-24T21:30:00",
    cost: "40€",
    venue: "Gastuche",
  },
  {
    slug: "padel-social-club-edition-8",
    title: "Padel Social Club édition #8",
    startDate: "2026-03-11T18:30:00",
    endDate: "2026-03-11T21:30:00",
    cost: "40€",
    venue: "Gastuche",
  },
  {
    slug: "le-padel-social-club-7",
    title: "Le Padel Social Club #7",
    startDate: "2026-01-21T18:30:00",
    endDate: "2026-01-21T21:30:00",
    cost: "40€",
    venue: "Gastuche",
  },
  {
    slug: "padel-social-club-5",
    title: "Padel Social Club #5",
    startDate: "2025-09-17T18:30:00",
    endDate: "2025-09-17T21:30:00",
    cost: "40€",
    venue: "Gastuche",
  },
  {
    slug: "psc-4",
    title: "PSC #4",
    startDate: "2025-08-02T13:30:00",
    endDate: "2025-08-02T16:30:00",
    cost: "40€",
    venue: "Gastuche",
  },
  {
    slug: "psc-episode-3",
    title: "PSC épisode 3",
    startDate: "2025-07-05T13:30:00",
    endDate: "2025-07-05T16:30:00",
    cost: "40€",
    venue: "Gastuche",
  },
  {
    slug: "psc-episode-2",
    title: "PSC épisode 2",
    startDate: "2025-06-07T13:30:00",
    endDate: "2025-06-07T16:30:00",
    cost: "40€",
    venue: "Gastuche",
  },
  {
    slug: "psc-episode-1",
    title: "PSC épisode 1",
    startDate: "2025-05-24T13:30:00",
    endDate: "2025-05-24T16:30:00",
    cost: "40€",
    venue: "Gastuche",
  },
];

/**
 * Returns the soonest upcoming event. Prefers events with confirmed dates;
 * falls back to a TBC (no date) event if no scheduled future events exist.
 */
export function getNextEvent(now: Date = new Date()): PadelEvent | null {
  const upcoming = events
    .filter(isScheduled)
    .filter((e) => new Date(e.startDate) >= now)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  if (upcoming.length > 0) return upcoming[0];
  return events.find((e) => !isScheduled(e)) ?? null;
}

export function getPastEvents(now: Date = new Date()): PadelEvent[] {
  return events
    .filter(isScheduled)
    .filter((e) => new Date(e.startDate) < now)
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
}

export { REGISTRATION_EMAIL, isScheduled };
