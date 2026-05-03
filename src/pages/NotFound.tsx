import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="font-accent text-2xl text-secondary uppercase">404</p>
        <h1 className="font-heading text-4xl md:text-5xl text-primary mt-2">Page introuvable</h1>
        <p className="text-foreground/70 mt-4">
          Cette page n'existe pas (ou plus). Retournez à l'accueil pour découvrir les prochains
          tournois.
        </p>
        <Button asChild className="mt-8">
          <Link to="/">Retour à l'accueil</Link>
        </Button>
      </div>
    </div>
  );
}
