import { NavLink, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "font-heading uppercase text-sm tracking-wide transition-colors",
    isActive ? "text-primary border-b-2 border-secondary pb-1" : "hover:text-primary",
  );

export function Header() {
  return (
    <header className="relative bg-background">
      <div className="container relative grid grid-cols-3 items-center py-4 md:py-6">
        {/* Left: nav */}
        <nav className="hidden md:flex items-center gap-8 justify-self-start">
          <NavLink to="/" end className={navLinkClass}>
            Accueil
          </NavLink>
          <NavLink to="/creez-votre-event" className={navLinkClass}>
            Créez votre Event
          </NavLink>
        </nav>

        {/* Center: oversized logo */}
        <Link to="/" className="justify-self-center" aria-label="Padel Social Club — accueil">
          <img
            src="/logo.png"
            alt="Padel Social Club"
            className="h-24 w-24 md:h-32 md:w-32 object-contain drop-shadow-sm"
          />
        </Link>

        {/* Right: CTA */}
        <div className="justify-self-end">
          <Button size="lg" className="rounded-full px-8" asChild>
            <a href="#prochain-tournoi">S'inscrire</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
