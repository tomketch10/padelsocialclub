export interface PadelEvent {
  slug: string;
  title: string;
  startDate: string;
  endDate: string;
  cost: string;
  venue: string;
  registrationUrl: string;
}

export const events: PadelEvent[] = [
  {
    slug: "le-padel-social-club-9",
    title: "Le Padel Social Club #9",
    startDate: "2026-04-24T18:30:00",
    endDate: "2026-04-24T21:30:00",
    cost: "40€",
    venue: "Gastuche",
    registrationUrl: "https://padelsocialclub.be/event/le-padel-social-club-9/",
  },
  {
    slug: "padel-social-club-edition-8",
    title: "Padel Social Club édition #8",
    startDate: "2026-03-11T18:30:00",
    endDate: "2026-03-11T21:30:00",
    cost: "40€",
    venue: "Gastuche",
    registrationUrl: "https://padelsocialclub.be/event/padel-social-club-edition-8/",
  },
  {
    slug: "le-padel-social-club-7",
    title: "Le Padel Social Club #7",
    startDate: "2026-01-21T18:30:00",
    endDate: "2026-01-21T21:30:00",
    cost: "40€",
    venue: "Gastuche",
    registrationUrl: "https://padelsocialclub.be/event/le-padel-social-club-7/",
  },
];

export function getNextEvent(now: Date = new Date()): PadelEvent | null {
  const upcoming = events
    .filter((e) => new Date(e.startDate) >= now)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  return upcoming[0] ?? null;
}
