import { Link } from "react-router-dom";
import { Instagram, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background mt-24">
      <div className="container py-14 grid gap-10 md:grid-cols-3">
        <div>
          <h3 className="font-heading text-xl uppercase mb-3">Padel Social Club</h3>
          <p className="text-sm text-background/70 max-w-xs">
            Le padel version social, fun et fair-play. Tournois à Gastuche au format Paradis / Enfer.
          </p>
        </div>

        <div>
          <h3 className="font-heading text-xl uppercase mb-3">Get in touch</h3>
          <a
            href="mailto:michael@i-management.be"
            className="inline-flex items-center gap-2 text-sm hover:text-secondary transition-colors"
          >
            <Mail className="h-4 w-4" /> michael@i-management.be
          </a>
        </div>

        <div>
          <h3 className="font-heading text-xl uppercase mb-3">Réseaux sociaux</h3>
          <a
            href="https://www.instagram.com/padelsocial_club"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm hover:text-secondary transition-colors"
          >
            <Instagram className="h-4 w-4" /> @padelsocial_club
          </a>
        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-background/60">
          <p>© {new Date().getFullYear()} Padel Social Club. All Rights Reserved.</p>
          <nav className="flex gap-6">
            <Link to="/cookies" className="hover:text-background">Cookies</Link>
            <Link to="/politique-de-confidentialite" className="hover:text-background">
              Politique de confidentialité
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
