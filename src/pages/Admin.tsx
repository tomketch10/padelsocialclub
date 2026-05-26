import { useEffect, useState, type FormEvent } from "react";
import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { events as eventsData } from "@/data/events";

interface Registration {
  id: number;
  event_slug: string;
  name: string;
  email: string;
  phone: string;
  status: "confirmed" | "waitlist" | "cancelled";
  created_at: string;
  cancelled_at: string | null;
}

const PASSWORD_KEY = "psc_admin_password";

export default function Admin() {
  const [password, setPassword] = useState<string | null>(() =>
    sessionStorage.getItem(PASSWORD_KEY),
  );
  const [registrations, setRegistrations] = useState<Registration[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    if (password === null) return;
    void loadRegistrations(password);
  }, [password]);

  async function loadRegistrations(pw: string) {
    setLoadError(null);
    try {
      const response = await fetch("/api/admin/registrations", {
        headers: { Authorization: basicAuth(pw) },
      });
      if (response.status === 401) {
        sessionStorage.removeItem(PASSWORD_KEY);
        setPassword(null);
        setLoadError("Mot de passe incorrect.");
        return;
      }
      if (!response.ok) {
        setLoadError(`Erreur ${response.status}`);
        return;
      }
      const data = (await response.json()) as { registrations: Registration[] };
      setRegistrations(data.registrations);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Erreur réseau");
    }
  }

  async function handleCancel(id: number) {
    if (
      !password ||
      !confirm(
        "Annuler cette inscription ? La personne suivante sur la liste d'attente sera promue automatiquement.",
      )
    ) {
      return;
    }
    setBusyId(id);
    try {
      const response = await fetch("/api/admin/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: basicAuth(password),
        },
        body: JSON.stringify({ registrationId: id }),
      });
      if (!response.ok) {
        alert(`Erreur (${response.status})`);
        return;
      }
      await loadRegistrations(password);
    } finally {
      setBusyId(null);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem(PASSWORD_KEY);
    setPassword(null);
    setRegistrations(null);
  }

  if (password === null) {
    return <LoginScreen onSubmit={(pw) => {
      sessionStorage.setItem(PASSWORD_KEY, pw);
      setPassword(pw);
    }} initialError={loadError} />;
  }

  if (registrations === null && loadError === null) {
    return (
      <PageLayout>
        <p className="container py-16">Chargement…</p>
      </PageLayout>
    );
  }

  if (registrations === null) {
    return (
      <PageLayout>
        <div className="container py-16 max-w-xl space-y-3">
          <h1 className="font-heading text-3xl text-primary uppercase">Erreur</h1>
          <p>{loadError}</p>
        </div>
      </PageLayout>
    );
  }

  const byEvent = groupByEvent(registrations);

  return (
    <PageLayout>
      <div className="container py-16 space-y-12">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="font-heading text-4xl md:text-5xl text-primary uppercase">Admin</h1>
            <p className="mt-2 text-foreground/75">
              {registrations.length} inscription{registrations.length === 1 ? "" : "s"} au total.
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Se déconnecter
          </Button>
        </header>

        {Object.keys(byEvent).length === 0 && (
          <p className="text-foreground/70">Aucune inscription pour le moment.</p>
        )}

        {Object.entries(byEvent).map(([slug, rows]) => {
          const event = eventsData.find((e) => e.slug === slug);
          const confirmed = rows.filter((r) => r.status === "confirmed");
          const waitlist = rows.filter((r) => r.status === "waitlist");
          const cancelled = rows.filter((r) => r.status === "cancelled");
          return (
            <section key={slug} className="space-y-6">
              <h2 className="font-heading text-2xl md:text-3xl text-foreground uppercase">
                {event?.title ?? slug}
                <span className="ml-3 text-base font-body normal-case text-foreground/60">
                  {confirmed.length} confirmé{confirmed.length === 1 ? "" : "s"}
                  {event?.capacity ? ` / ${event.capacity}` : ""}
                  {waitlist.length > 0 && ` · ${waitlist.length} en attente`}
                </span>
              </h2>
              <RegistrationsTable
                title="Confirmé(e)s"
                rows={confirmed}
                onCancel={handleCancel}
                busyId={busyId}
              />
              {waitlist.length > 0 && (
                <RegistrationsTable
                  title="Liste d'attente"
                  rows={waitlist}
                  onCancel={handleCancel}
                  busyId={busyId}
                />
              )}
              {cancelled.length > 0 && (
                <details>
                  <summary className="cursor-pointer text-sm text-foreground/60">
                    {cancelled.length} annulé{cancelled.length === 1 ? "" : "s"}
                  </summary>
                  <RegistrationsTable title="" rows={cancelled} onCancel={null} busyId={null} />
                </details>
              )}
            </section>
          );
        })}
      </div>
    </PageLayout>
  );
}

function LoginScreen({
  onSubmit,
  initialError,
}: {
  onSubmit: (password: string) => void;
  initialError: string | null;
}) {
  const [password, setPasswordInput] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.trim()) onSubmit(password.trim());
  }
  return (
    <PageLayout>
      <div className="container py-16 max-w-md">
        <h1 className="font-heading text-4xl text-primary uppercase mb-6">Admin</h1>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="admin-pw" className="block text-sm font-medium">
              Mot de passe
            </label>
            <input
              id="admin-pw"
              type="password"
              value={password}
              onChange={(e) => setPasswordInput(e.target.value)}
              autoFocus
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {initialError && (
            <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md px-3 py-2">
              {initialError}
            </p>
          )}
          <Button type="submit" size="lg" className="rounded-full px-10">
            Se connecter
          </Button>
        </form>
      </div>
    </PageLayout>
  );
}

function RegistrationsTable({
  title,
  rows,
  onCancel,
  busyId,
}: {
  title: string;
  rows: Registration[];
  onCancel: ((id: number) => void) | null;
  busyId: number | null;
}) {
  if (rows.length === 0) return null;
  return (
    <div className="space-y-2">
      {title && (
        <h3 className="font-heading uppercase text-sm tracking-wide text-foreground/70">{title}</h3>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border/60">
            <tr className="text-left text-foreground/60">
              <th className="py-2 pr-3">#</th>
              <th className="py-2 pr-3">Nom</th>
              <th className="py-2 pr-3">Email</th>
              <th className="py-2 pr-3">Téléphone</th>
              <th className="py-2 pr-3">Inscrit le</th>
              {onCancel && <th className="py-2 pr-3"></th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.id} className="border-b border-border/40">
                <td className="py-2 pr-3 text-foreground/60">{idx + 1}</td>
                <td className="py-2 pr-3 font-medium">{row.name}</td>
                <td className="py-2 pr-3">
                  <a href={`mailto:${row.email}`} className="underline">
                    {row.email}
                  </a>
                </td>
                <td className="py-2 pr-3">
                  <a href={`tel:${row.phone}`} className="underline">
                    {row.phone}
                  </a>
                </td>
                <td className="py-2 pr-3 text-foreground/60">{formatDate(row.created_at)}</td>
                {onCancel && (
                  <td className="py-2 pr-3">
                    <button
                      onClick={() => onCancel(row.id)}
                      disabled={busyId === row.id}
                      className="text-xs text-destructive hover:underline disabled:opacity-50"
                    >
                      {busyId === row.id ? "…" : "Annuler"}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function basicAuth(password: string): string {
  return `Basic ${btoa(`admin:${password}`)}`;
}

function groupByEvent(rows: Registration[]): Record<string, Registration[]> {
  const grouped: Record<string, Registration[]> = {};
  for (const row of rows) {
    (grouped[row.event_slug] ??= []).push(row);
  }
  return grouped;
}

function formatDate(iso: string): string {
  const normalized = iso.includes("T") ? iso : iso.replace(" ", "T") + "Z";
  return new Date(normalized).toLocaleString("fr-BE", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
