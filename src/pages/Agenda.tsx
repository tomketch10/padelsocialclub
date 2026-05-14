import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import {
  events,
  getNextEvent,
  getPastEvents,
  registrationMailto,
  type PadelEvent,
} from "@/data/events";
import { CalendarDays, MapPin, Tag } from "lucide-react";

const longDateFormatter = new Intl.DateTimeFormat("fr-BE", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("fr-BE", {
  hour: "2-digit",
  minute: "2-digit",
});

export default function Agenda() {
  const next = getNextEvent();
  const upcoming = events
    .filter((e) => new Date(e.startDate) >= new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  const past = getPastEvents();

  return (
    <PageLayout>
      <section className="container pt-16 pb-12 max-w-4xl">
        <h1 className="font-heading text-4xl md:text-6xl text-primary uppercase">Agenda</h1>
        <p className="mt-6 text-foreground/85 text-lg">
          {next
            ? "Voici tous les tournois à venir et l'historique des éditions passées."
            : "Aucun tournoi n'est planifié pour le moment. Suivez-nous sur Instagram pour ne rien manquer !"}
        </p>
      </section>

      {upcoming.length > 0 && (
        <section className="container pb-12 max-w-4xl">
          <h2 className="font-heading text-2xl md:text-3xl text-foreground uppercase mb-6">
            À venir
          </h2>
          <ul className="space-y-4">
            {upcoming.map((event) => (
              <UpcomingRow key={event.slug} event={event} />
            ))}
          </ul>
        </section>
      )}

      {past.length > 0 && (
        <section className="container pb-24 max-w-4xl">
          <h2 className="font-heading text-2xl md:text-3xl text-foreground uppercase mb-6">
            Éditions passées
          </h2>
          <ul className="space-y-3">
            {past.map((event) => (
              <PastRow key={event.slug} event={event} />
            ))}
          </ul>
        </section>
      )}
    </PageLayout>
  );
}

function UpcomingRow({ event }: { event: PadelEvent }) {
  return (
    <li className="bg-card border border-border/60 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
      <div className="flex-1 space-y-2">
        <h3 className="font-heading text-xl md:text-2xl text-primary uppercase">{event.title}</h3>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-foreground/80">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-secondary" />
            {longDateFormatter.format(new Date(event.startDate))}
            {" — "}
            {timeFormatter.format(new Date(event.startDate))}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-secondary" />
            {event.venue}
          </span>
          <span className="inline-flex items-center gap-2">
            <Tag className="h-4 w-4 text-secondary" />
            {event.cost}
          </span>
        </div>
      </div>
      <Button className="rounded-full px-8" asChild>
        <a href={registrationMailto(event)}>S'inscrire</a>
      </Button>
    </li>
  );
}

function PastRow({ event }: { event: PadelEvent }) {
  return (
    <li className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-border/60 pb-3">
      <span className="font-heading uppercase text-foreground/80">{event.title}</span>
      <span className="text-sm text-foreground/60">
        {longDateFormatter.format(new Date(event.startDate))}
      </span>
    </li>
  );
}
