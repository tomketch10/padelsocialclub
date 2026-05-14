import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { getNextEvent, registrationMailto } from "@/data/events";
import { ArrowDown, MapPin, CalendarDays, Clock, Tag, Trophy } from "lucide-react";

const dateFormatter = new Intl.DateTimeFormat("fr-BE", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

const timeFormatter = new Intl.DateTimeFormat("fr-BE", {
  hour: "2-digit",
  minute: "2-digit",
});

export default function Home() {
  const next = getNextEvent();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero */}
      <section className="relative bg-background pb-20 md:pb-28">
        <div className="container grid gap-10 lg:grid-cols-[1.1fr_1fr] items-center pt-12 md:pt-16">
          <div className="space-y-10">
            <h1 className="font-heading text-5xl md:text-7xl lg:text-[5.5rem] text-primary leading-[0.95]">
              Le padel version social, fun et fair-play
            </h1>
            <a
              href="#prochain-tournoi"
              className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-md"
              aria-label="Aller au prochain tournoi"
            >
              <ArrowDown className="h-6 w-6" />
            </a>
          </div>

          <div className="relative">
            <img
              src="/illustrations/players-hero.webp"
              alt="Joueurs de padel"
              className="w-full max-h-[36rem] object-contain object-bottom"
            />
          </div>
        </div>
      </section>

      {/* Next event prose */}
      {next && (
        <section id="prochain-tournoi" className="bg-background pb-24">
          <div className="container max-w-3xl space-y-5 text-foreground/85 text-lg leading-relaxed">
            <h2 className="flex items-center gap-3 font-heading text-3xl md:text-4xl text-foreground">
              <span aria-hidden>🎾</span> {next.title} !
            </h2>
            <p>
              Nous avons le plaisir de vous inviter à la{" "}
              <strong>
                {editionNumber(next.title)}
                {sup("e")} édition du PSC
              </strong>
              , qui aura lieu le{" "}
              <strong>{dateFormatter.format(new Date(next.startDate)).toUpperCase()}</strong>, de{" "}
              <strong>
                {timeFormatter.format(new Date(next.startDate))} à{" "}
                {timeFormatter.format(new Date(next.endDate))}
              </strong>{" "}
              au Gastuche (Chau. de Wavre, 504, 1390 Grez-Doiceau) sur 7 terrains.
            </p>
            <p>
              Au programme : notre désormais célèbre format <strong>Paradis / Enfer</strong>, en
              individuel, dans une ambiance{" "}
              <strong>chaleureuse, fair-play et pleine d'énergie</strong>.
            </p>
            <p>
              Places limitées à <strong>30 participants</strong> — premiers inscrits, premiers
              servis !
            </p>
            <p>
              Compris dans le prix de <strong>{next.cost}</strong> : 3h de padel (24€), des balles
              neuves (2€), 2 boissons après le match (7€) et l'organisation.
            </p>
            <p>
              <strong>Niveau requis</strong> : avoir déjà joué au moins 15 matchs de padel —
              histoire de pouvoir bien profiter du format !
            </p>
            <div className="pt-4">
              <Button size="lg" className="rounded-full px-10" asChild>
                <a href={registrationMailto(next)}>S'inscrire au tournoi</a>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Diagonal cream → brick transition + info section */}
      <section className="relative bg-primary text-primary-foreground overflow-hidden [clip-path:polygon(0_4rem,100%_0,100%_calc(100%_-_4rem),0_100%)] -mt-16 pt-32 pb-32 md:pt-40 md:pb-40">
        {/* Faded background photo */}
        <img
          src="/illustrations/players-handshake.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-overlay pointer-events-none"
        />
        {/* Floating whiskey glass */}
        <img
          src="/illustrations/whiskey-glass.svg"
          alt=""
          aria-hidden="true"
          className="absolute -top-2 right-4 md:right-16 w-24 h-24 md:w-36 md:h-36 pointer-events-none"
        />

        <div className="container relative">
          <div className="text-center mb-16 space-y-3">
            <h2 className="font-heading text-4xl md:text-6xl uppercase tracking-tight">
              Objectif : se faire plaisir
            </h2>
            <p className="font-accent text-2xl md:text-3xl text-primary-foreground/85">
              Ambiance cool et sportive
            </p>
          </div>

          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            <InfoCard icon={<MapPin className="h-12 w-12 text-secondary" strokeWidth={1.5} />} title="Lieu">
              Gastuche
            </InfoCard>
            <InfoCard icon={<CalendarDays className="h-12 w-12 text-secondary" strokeWidth={1.5} />} title="Dates">
              Prochaines dates :<br />
              {next ? dateFormatter.format(new Date(next.startDate)).toUpperCase() : "—"}
            </InfoCard>
            <InfoCard icon={<Clock className="h-12 w-12 text-secondary" strokeWidth={1.5} />} title="Heure">
              18h30 à 21h30
            </InfoCard>
            <InfoCard icon={<Tag className="h-12 w-12 text-secondary" strokeWidth={1.5} />} title="Prix">
              40€ / joueur pour 3h de padel
            </InfoCard>
            <InfoCard icon={<Trophy className="h-12 w-12 text-secondary" strokeWidth={1.5} />} title="Format">
              7 terrains, Paradis / Enfer et tournoi
            </InfoCard>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-3">
      {icon}
      <h3 className="font-heading text-xl uppercase tracking-wide">{title}</h3>
      <p className="text-sm text-primary-foreground/85 max-w-[18ch]">{children}</p>
    </div>
  );
}

function sup(text: string) {
  return <sup>{text}</sup>;
}

function editionNumber(title: string): string {
  const match = title.match(/#(\d+)/);
  return match ? match[1] : "";
}
