import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { getNextEvent } from "@/data/events";
import { CalendarDays, Clock, MapPin, Tag, Users, Trophy } from "lucide-react";

const dateFormatter = new Intl.DateTimeFormat("fr-BE", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("fr-BE", {
  hour: "2-digit",
  minute: "2-digit",
});

export default function Home() {
  const next = getNextEvent();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container py-20 md:py-28 grid gap-10 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <p className="font-accent text-2xl text-secondary uppercase tracking-wider">
              Tournois de padel & événements
            </p>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl text-primary leading-[0.95]">
              Le padel version social, fun et fair-play
            </h1>
            <p className="text-lg text-foreground/80 max-w-xl">
              Format <strong>Paradis / Enfer</strong>, ambiance chaleureuse, fair-play et pleine
              d'énergie. Places limitées à 30 participants — premiers inscrits, premiers servis.
            </p>
            {next && (
              <div className="flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <a href={next.registrationUrl} target="_blank" rel="noreferrer">
                    S'inscrire au prochain tournoi
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#agenda">Voir l'agenda</a>
                </Button>
              </div>
            )}
          </div>

          {next && (
            <div className="bg-card rounded-2xl shadow-xl p-8 border border-border/60">
              <p className="font-accent text-xl text-secondary uppercase">Prochain tournoi</p>
              <h2 className="font-heading text-3xl md:text-4xl text-primary mt-1">
                {next.title}
              </h2>
              <div className="mt-6 grid gap-3 text-foreground/85">
                <Row icon={<CalendarDays />} label={dateFormatter.format(new Date(next.startDate))} />
                <Row
                  icon={<Clock />}
                  label={`${timeFormatter.format(new Date(next.startDate))} – ${timeFormatter.format(new Date(next.endDate))}`}
                />
                <Row icon={<MapPin />} label={next.venue} />
                <Row icon={<Tag />} label={`${next.cost} / joueur`} />
              </div>
              <Button size="lg" className="mt-6 w-full" asChild>
                <a href={next.registrationUrl} target="_blank" rel="noreferrer">
                  S'inscrire
                </a>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Info cards */}
      <section className="container pb-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card icon={<MapPin />} title="Lieu" body="Gastuche — Chau. de Wavre, 504, 1390 Grez-Doiceau" />
          <Card icon={<Clock />} title="Horaire" body="18h30 à 21h30 (3h de jeu)" />
          <Card icon={<Tag />} title="Prix" body="40€ / joueur · balles et 2 boissons incluses" />
          <Card icon={<Trophy />} title="Format" body="7 terrains · Paradis / Enfer · individuel" />
          <Card icon={<Users />} title="Niveau" body="Avoir déjà joué ≥ 15 matchs de padel" />
          <Card icon={<Users />} title="Places" body="Limitées à 30 — premiers inscrits, premiers servis" />
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Row({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-primary">{icon}</span>
      <span className="capitalize">{label}</span>
    </div>
  );
}

function Card({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="bg-card border border-border/60 rounded-xl p-6 shadow-sm">
      <div className="text-primary mb-2">{icon}</div>
      <h3 className="font-heading text-xl uppercase text-foreground">{title}</h3>
      <p className="text-sm text-foreground/75 mt-1">{body}</p>
    </div>
  );
}
