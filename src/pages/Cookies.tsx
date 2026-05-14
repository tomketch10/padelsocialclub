import { PageLayout } from "@/components/PageLayout";
import { Prose } from "@/components/Prose";

export default function Cookies() {
  return (
    <PageLayout>
      <Prose>
        <h1>Politique de cookies</h1>
        <p>
          <strong>Ce site n'utilise aucun cookie.</strong>
        </p>
        <p>
          Pas de tracking, pas de publicité, pas d'analytics. Aucune information n'est stockée
          sur votre appareil par notre site.
        </p>
        <p>
          Les seuls services tiers que nous chargeons sont les polices de caractères depuis Google
          Fonts. Google peut enregistrer votre adresse IP au moment du chargement des polices,
          mais ne dépose pas de cookies via cette ressource.
        </p>
        <h2>Liens externes</h2>
        <p>
          Notre site contient des liens vers Instagram et vers une adresse e-mail. Ces services
          tiers ont leurs propres politiques de cookies, indépendantes de la nôtre.
        </p>
        <h2>Questions ?</h2>
        <p>
          Si vous avez la moindre question, écrivez-nous à{" "}
          <a href="mailto:michael@i-management.be">michael@i-management.be</a>.
        </p>
      </Prose>
    </PageLayout>
  );
}
