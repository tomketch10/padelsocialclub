import { PageLayout } from "@/components/PageLayout";
import { Prose } from "@/components/Prose";

export default function PrivacyPolicy() {
  return (
    <PageLayout>
      <Prose>
        <h1>Politique de confidentialité</h1>

        <h2>1. Présentation</h2>
        <p>
          Le <strong>Padel Social Club</strong>, accessible à l'adresse{" "}
          <a href="https://padelsocialclub.be">https://padelsocialclub.be</a>, attache une grande
          importance à la protection de votre vie privée. La présente politique de confidentialité
          a pour but de vous informer de manière claire et transparente sur la manière dont vos
          données personnelles sont collectées, traitées et utilisées.
        </p>

        <h2>2. Responsable du traitement</h2>
        <p>Le responsable du traitement des données est :</p>
        <p>
          <strong>Padel Social Club</strong>
          <br />
          Email : <a href="mailto:michael@i-management.be">michael@i-management.be</a>
          <br />
          Adresse : Steenwagenstraat 56, 1820 Steenokkerzeel, Belgique
        </p>

        <h2>3. Données personnelles collectées</h2>
        <p>
          Nous collectons uniquement les données nécessaires à la gestion de nos événements et à
          la communication avec les utilisateurs du site.
        </p>
        <h3>Données que vous nous communiquez :</h3>
        <ul>
          <li>Nom, prénom</li>
          <li>Adresse e-mail</li>
          <li>Numéro de téléphone (si fourni)</li>
          <li>
            Niveau de jeu, nom du partenaire, commentaires (via les formulaires d'inscription)
          </li>
        </ul>
        <h3>Données collectées automatiquement :</h3>
        <ul>
          <li>Adresse IP</li>
          <li>Type de navigateur, système d'exploitation</li>
          <li>Données de navigation</li>
        </ul>

        <h2>4. Finalités du traitement</h2>
        <p>Vos données personnelles sont collectées pour les finalités suivantes :</p>
        <ul>
          <li>
            Gestion des inscriptions aux événements (création de listes, envoi d'e-mails de
            confirmation)
          </li>
          <li>Gestion des listes d'attente</li>
          <li>Communication d'informations liées aux événements</li>
          <li>Statistiques de fréquentation du site (si applicable)</li>
        </ul>

        <h2>5. Base légale du traitement</h2>
        <p>
          Conformément au Règlement Général sur la Protection des Données (RGPD), le traitement
          repose sur :
        </p>
        <ul>
          <li>Votre consentement (formulaires d'inscription)</li>
          <li>L'exécution d'un contrat (participation à un événement)</li>
          <li>L'intérêt légitime (statistiques anonymes, amélioration du service)</li>
        </ul>

        <h2>6. Durée de conservation</h2>
        <p>
          Vos données personnelles sont conservées pour la durée strictement nécessaire à la
          finalité du traitement, à savoir :
        </p>
        <ul>
          <li>Jusqu'à 12 mois après la fin de l'événement concerné</li>
          <li>Jusqu'à votre demande de suppression</li>
        </ul>

        <h2>7. Cookies</h2>
        <p>
          Ce site n'utilise aucun cookie de suivi. Voir notre{" "}
          <a href="/cookies">politique de cookies</a> pour plus de détails.
        </p>

        <h2>8. Destinataires des données</h2>
        <p>Vos données personnelles ne sont jamais vendues ni cédées à des tiers.</p>
        <p>Elles peuvent être accessibles uniquement à :</p>
        <ul>
          <li>L'équipe du Padel Social Club</li>
          <li>
            Nos sous-traitants techniques (hébergeur, plugin de formulaire, outil d'emailing)
          </li>
        </ul>
        <p>Tous les sous-traitants respectent les obligations du RGPD.</p>

        <h2>9. Sécurité des données</h2>
        <p>
          Nous mettons en œuvre toutes les mesures techniques et organisationnelles nécessaires
          pour garantir la sécurité de vos données (HTTPS, gestion des accès, sauvegardes).
        </p>

        <h2>10. Vos droits</h2>
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
        <ul>
          <li>Droit d'accès à vos données</li>
          <li>Droit de rectification</li>
          <li>Droit à l'effacement (« droit à l'oubli »)</li>
          <li>Droit à la limitation du traitement</li>
          <li>Droit d'opposition</li>
          <li>Droit à la portabilité</li>
        </ul>
        <p>
          Vous pouvez exercer vos droits en nous écrivant à{" "}
          <a href="mailto:michael@i-management.be">michael@i-management.be</a>. Nous vous
          répondrons sous 30 jours.
        </p>

        <h2>11. Réclamation</h2>
        <p>
          Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une
          réclamation auprès de l'Autorité de Protection des Données (APD) :{" "}
          <a
            href="https://www.autoriteprotectiondonnees.be/"
            target="_blank"
            rel="noreferrer noopener"
          >
            autoriteprotectiondonnees.be
          </a>
          .
        </p>

        <h2>12. Mise à jour de la politique</h2>
        <p>
          Cette politique de confidentialité peut être mise à jour à tout moment. Dernière mise à
          jour : <strong>19/06/2025</strong>.
        </p>
      </Prose>
    </PageLayout>
  );
}
