import type { ContactData } from "./contact-schema";

const EVENT_LABELS: Record<ContactData["eventType"], string> = {
  casament: "Casament",
  empresa: "Esdeveniment d'empresa",
  celebracio: "Celebració privada",
  altre: "Un altre",
};

const SERVICE_LABELS: Record<ContactData["services"][number], string> = {
  tall: "Tall de pernil en directe",
  "pa-amb-tomaquet": "Pa amb tomàquet i oli",
  "a-mida": "Experiència a mida",
};

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

/** Correo que recibe Joan con la solicitud de presupuesto (siempre en catalán). */
export function buildContactEmail(data: ContactData, locale: string) {
  const subject = `Nova sol·licitud: ${EVENT_LABELS[data.eventType].toLowerCase()} el ${formatDate(data.date)} · ${data.guests} convidats`;
  const lines = [
    `Nom: ${data.name}`,
    `Email: ${data.email}`,
    `Telèfon: ${data.phone || "—"}`,
    "",
    `Tipus d'esdeveniment: ${EVENT_LABELS[data.eventType]}`,
    `Data: ${formatDate(data.date)}`,
    `Lloc: ${data.place}`,
    `Horari: ${data.time || "—"}`,
    `Convidats: ${data.guests}`,
    `Serveis: ${data.services.length ? data.services.map((s) => SERVICE_LABELS[s]).join(", ") : "—"}`,
    "",
    "Missatge:",
    data.message || "—",
    "",
    `(Enviat des de la web, idioma: ${locale})`,
  ];
  return { subject, text: lines.join("\n") };
}
