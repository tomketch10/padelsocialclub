import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Trophy, Users, PartyPopper } from "lucide-react";
import { REGISTRATION_EMAIL } from "@/data/events";

const eventMailto = `mailto:${REGISTRATION_EMAIL}?subject=${encodeURIComponent(
  "Demande d'organisation d'un événement Padel Social Club",
)}`;

export default function CreezVotreEvent() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="container py-16 md:py-24 text-center max-w-3xl">
        <h1 className="font-heading text-4xl md:text-6xl text-primary leading-tight">
          Événements Padel Business Club
        </h1>
        <p className="mt-8 text-lg text-foreground/85 leading-relaxed">
          Au Padel Social Club, <strong>les événements sont bien plus que de simples tournois</strong> :
          ce sont des expériences à vivre, à partager et à revivre. Chaque rencontre est pensée
          pour rassembler une communauté passionnée{" "}
          <strong>autour du padel, dans une ambiance conviviale, compétitive et festive.</strong>
        </p>
        <div className="mt-10">
          <Button size="lg" className="rounded-full px-10" asChild>
            <a href={eventMailto}>Créons votre event</a>
          </Button>
        </div>
      </section>

      {/* Value props on brick */}
      <section className="relative bg-primary text-primary-foreground overflow-hidden [clip-path:polygon(0_4rem,100%_0,100%_calc(100%_-_4rem),0_100%)] -mt-8 pt-32 pb-32 md:pt-40 md:pb-40">
        <div className="container relative">
          <div className="text-center mb-14 space-y-3">
            <h2 className="font-heading text-3xl md:text-5xl uppercase">
              Un format taillé pour votre équipe
            </h2>
            <p className="font-accent text-2xl md:text-3xl text-primary-foreground/85">
              Soirées d'entreprise, anniversaires, team-building
            </p>
          </div>

          <div className="grid gap-x-8 gap-y-12 md:grid-cols-3 max-w-5xl mx-auto">
            <ValueCard
              icon={<Trophy className="h-12 w-12 text-secondary" strokeWidth={1.5} />}
              title="Format sur mesure"
            >
              Tournoi, Paradis / Enfer, americano… on adapte le format à votre groupe.
            </ValueCard>
            <ValueCard
              icon={<Users className="h-12 w-12 text-secondary" strokeWidth={1.5} />}
              title="De 10 à 60 joueurs"
            >
              Tous niveaux. Nous proposons un encadrement adapté pour que chacun s'amuse.
            </ValueCard>
            <ValueCard
              icon={<PartyPopper className="h-12 w-12 text-secondary" strokeWidth={1.5} />}
              title="Catering & ambiance"
            >
              Boissons, food trucks, DJ — on s'occupe de tout pour que votre soirée soit
              mémorable.
            </ValueCard>
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-24 text-center max-w-2xl">
        <h2 className="font-heading text-2xl md:text-4xl text-primary uppercase">
          Parlons de votre projet
        </h2>
        <p className="mt-6 text-foreground/85">
          Envoyez-nous un mot avec votre date, votre nombre de joueurs et vos envies — on
          revient vers vous très vite avec une proposition.
        </p>
        <div className="mt-8">
          <Button size="lg" className="rounded-full px-10" asChild>
            <a href={eventMailto}>Nous contacter</a>
          </Button>
        </div>
      </section>
    </PageLayout>
  );
}

function ValueCard({
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
      <p className="text-sm text-primary-foreground/85 max-w-[22ch]">{children}</p>
    </div>
  );
}
