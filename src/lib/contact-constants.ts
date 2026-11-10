/** Constantes del formulario que también usa el navegador (sin dependencias pesadas). */
export const EVENT_TYPES = ["casament", "empresa", "celebracio", "altre"] as const;
export const SERVICES = ["tall", "pa-amb-tomaquet", "a-mida"] as const;

export type EventType = (typeof EVENT_TYPES)[number];
export type Service = (typeof SERVICES)[number];

/** Códigos de error; la interfaz los traduce con el diccionario (quote.errors). */
export type FieldError = "required" | "email" | "date" | "guests" | "privacy" | "tooLong";
export type FieldName =
  | "name" | "email" | "phone" | "date" | "place" | "time" | "guests" | "eventType" | "services" | "message" | "privacy";

/** Fecha de hoy (YYYY-MM-DD) en hora de Madrid, para no rechazar "hoy" por la diferencia horaria. */
export function todayISO(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(new Date());
}
