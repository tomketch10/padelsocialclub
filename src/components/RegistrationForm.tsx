import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import type { PadelEvent } from "@/data/events";
import { CheckCircle2, Hourglass, Info } from "lucide-react";

type SubmitStatus = "idle" | "submitting" | "confirmed" | "waitlist" | "error";

interface EventStatus {
  capacity: number | null;
  confirmed: number;
  full: boolean;
  accepting: boolean;
}

interface RegistrationFormProps {
  event: PadelEvent;
}

interface RegisterResponse {
  status?: "confirmed" | "waitlist";
  position?: number;
  error?: string;
}

export function RegistrationForm({ event }: RegistrationFormProps) {
  const [eventStatus, setEventStatus] = useState<EventStatus | null>(null);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [waitlistPosition, setWaitlistPosition] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch(`/api/event-status?slug=${encodeURIComponent(event.slug)}`);
        if (!response.ok) return;
        const data = (await response.json()) as EventStatus;
        if (!cancelled) setEventStatus(data);
      } catch {
        // Non-fatal: form still works, just without the upfront full/open banner.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [event.slug]);

  async function handleSubmit(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    setSubmitStatus("submitting");
    setErrorMessage(null);

    const formData = new FormData(formEvent.currentTarget);
    const payload = {
      eventSlug: event.slug,
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      levelConfirmed: formData.get("levelConfirmed") === "on",
    };

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as RegisterResponse;
      if (!response.ok || !data.status) {
        setSubmitStatus("error");
        setErrorMessage(data.error ?? "Une erreur est survenue. Réessaie dans un instant.");
        return;
      }
      setSubmitStatus(data.status);
      setWaitlistPosition(data.position ?? null);
    } catch {
      setSubmitStatus("error");
      setErrorMessage(
        "Impossible de joindre le serveur. Vérifie ta connexion et réessaie.",
      );
    }
  }

  if (submitStatus === "confirmed") {
    return (
      <SuccessPanel
        icon={<CheckCircle2 className="h-10 w-10 text-emerald-600" strokeWidth={1.5} />}
        title="Inscription confirmée !"
      >
        Ta place pour <strong>{event.title}</strong> est réservée. Tu reçois un email avec tous les
        détails — pense à vérifier tes spams si tu ne le vois pas.
      </SuccessPanel>
    );
  }

  if (submitStatus === "waitlist") {
    return (
      <SuccessPanel
        icon={<Hourglass className="h-10 w-10 text-secondary" strokeWidth={1.5} />}
        title="Tu es sur la liste d'attente"
      >
        Le tournoi est complet, mais tu es en{" "}
        <strong>position {waitlistPosition ?? "?"}</strong> sur la liste d'attente. Si une place se
        libère, on te prévient par email immédiatement.
      </SuccessPanel>
    );
  }

  const submitting = submitStatus === "submitting";
  const isFull = eventStatus?.full === true;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {eventStatus && (
        <CapacityBanner status={eventStatus} />
      )}
      <Field label="Nom et prénom" name="name" type="text" autoComplete="name" required />
      <Field label="Email" name="email" type="email" autoComplete="email" required />
      <Field label="Téléphone" name="phone" type="tel" autoComplete="tel" required />
      <label className="flex items-start gap-3 text-sm text-foreground/85 cursor-pointer">
        <input
          type="checkbox"
          name="levelConfirmed"
          required
          className="mt-1 h-4 w-4 rounded border-border accent-primary"
        />
        <span>
          Je confirme avoir déjà joué <strong>au moins 15 matchs de padel</strong> (niveau requis
          pour profiter du format).
        </span>
      </label>
      {errorMessage && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md px-3 py-2">
          {errorMessage}
        </p>
      )}
      <Button type="submit" size="lg" className="rounded-full px-10" disabled={submitting}>
        {submitting ? "Envoi…" : isFull ? "Rejoindre la liste d'attente" : "Réserver ma place"}
      </Button>
    </form>
  );
}

function CapacityBanner({ status }: { status: EventStatus }) {
  if (!status.accepting || status.capacity === null) return null;
  if (status.full) {
    return (
      <div className="flex gap-3 rounded-md border border-secondary/50 bg-secondary/10 px-4 py-3 text-sm">
        <Hourglass className="h-5 w-5 shrink-0 text-secondary mt-0.5" strokeWidth={1.75} />
        <p>
          <strong>Le tournoi est complet</strong> ({status.confirmed}/{status.capacity}). Tu peux
          encore t'inscrire <strong>sur la liste d'attente</strong> — on te prévient dès qu'une
          place se libère.
        </p>
      </div>
    );
  }
  const remaining = status.capacity - status.confirmed;
  if (remaining <= 5) {
    return (
      <div className="flex gap-3 rounded-md border border-secondary/50 bg-secondary/10 px-4 py-3 text-sm">
        <Info className="h-5 w-5 shrink-0 text-secondary mt-0.5" strokeWidth={1.75} />
        <p>
          Plus que <strong>{remaining} place{remaining === 1 ? "" : "s"}</strong> sur {status.capacity}.
        </p>
      </div>
    );
  }
  return null;
}

function Field({
  label,
  name,
  type,
  autoComplete,
  required,
}: {
  label: string;
  name: string;
  type: "text" | "email" | "tel";
  autoComplete?: string;
  required?: boolean;
}) {
  const id = `reg-${name}`;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
      />
    </div>
  );
}

function SuccessPanel({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-6 flex gap-4 items-start">
      <div className="shrink-0">{icon}</div>
      <div className="space-y-2">
        <h3 className="font-heading text-2xl uppercase text-foreground">{title}</h3>
        <p className="text-foreground/85">{children}</p>
      </div>
    </div>
  );
}
