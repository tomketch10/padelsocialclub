import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background">
      <div className="container py-16 grid gap-12 md:grid-cols-4 items-start">
        <Link to="/" aria-label="Padel Social Club — accueil">
          <img src="/logo.png" alt="Padel Social Club" className="h-28 w-28 object-contain" />
        </Link>

        <div>
          <h3 className="font-heading text-lg uppercase mb-4 tracking-wide">Réseaux sociaux</h3>
          <a
            href="https://www.instagram.com/padelsocial_club"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 text-sm hover:text-primary transition-colors"
          >
            <Instagram className="h-5 w-5 text-primary" /> padelsocial_club
          </a>
        </div>

        <div>
          <h3 className="font-heading text-lg uppercase mb-4 tracking-wide">Get in touch</h3>
          <a
            href="mailto:michael@i-management.be"
            className="text-sm hover:text-primary transition-colors"
          >
            michael@i-management.be
          </a>
        </div>

        <div>
          <h3 className="font-heading text-lg uppercase mb-4 tracking-wide">Mentions légales</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/cookies" className="text-secondary hover:text-primary transition-colors">
                Cookie
              </Link>
            </li>
            <li>
              <Link
                to="/politique-de-confidentialite"
                className="text-secondary hover:text-primary transition-colors"
              >
                Politique de confidentialité
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-primary text-primary-foreground">
        <p className="container py-4 text-center text-sm">
          © {new Date().getFullYear()} All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
