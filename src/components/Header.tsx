import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Padel Social Club" className="h-10 w-10 rounded-full" />
          <span className="font-heading text-lg uppercase tracking-wider text-primary">
            Padel Social Club
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 font-heading uppercase text-sm tracking-wide">
          <Link to="/" className="hover:text-primary transition-colors">
            Accueil
          </Link>
          <Link to="/creez-votre-event" className="hover:text-primary transition-colors">
            Créez votre Event
          </Link>
        </nav>
      </div>
    </header>
  );
}
