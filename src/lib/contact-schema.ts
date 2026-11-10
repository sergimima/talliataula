import { z } from "zod";
import { EVENT_TYPES, SERVICES, todayISO, type EventType, type FieldError, type FieldName } from "./contact-constants";

export { EVENT_TYPES, SERVICES, todayISO };
export type { EventType, FieldError, FieldName };

const requiredText = (max: number) =>
  z.string().trim().min(1, { error: "required" }).max(max, { error: "tooLong" });
const optionalText = (max: number) => z.string().trim().max(max, { error: "tooLong" });

const schema = z.object({
  name: requiredText(120),
  email: z
    .string()
    .trim()
    .min(1, { error: "required" })
    .max(200, { error: "tooLong" })
    .pipe(z.email({ error: "email" })),
  phone: optionalText(40),
  date: z
    .string()
    .trim()
    .min(1, { error: "required" })
    .regex(/^\d{4}-\d{2}-\d{2}$/, { error: "date" })
    .refine((v) => v >= todayISO(), { error: "date" }),
  place: requiredText(200),
  time: optionalText(80),
  guests: z
    .string()
    .trim()
    .min(1, { error: "required" })
    .regex(/^\d+$/, { error: "guests" })
    .transform(Number)
    .refine((n) => n >= 1 && n <= 5000, { error: "guests" }),
  eventType: z.string().transform((v): EventType => ((EVENT_TYPES as readonly string[]).includes(v) ? (v as EventType) : "altre")),
  services: z.array(z.string()).transform((list) => SERVICES.filter((s) => list.includes(s))),
  message: optionalText(3000),
  privacy: z.literal("on", { error: "privacy" }),
});

export type ContactData = z.output<typeof schema>;

export type ParseResult =
  | { ok: true; data: ContactData }
  | { ok: false; spam: boolean; errors: Partial<Record<FieldName, FieldError>> };

const str = (f: FormData, k: string) => {
  const v = f.get(k);
  return typeof v === "string" ? v : "";
};

export function parseContactForm(form: FormData): ParseResult {
  if (str(form, "web").trim() !== "") {
    return { ok: false, spam: true, errors: {} };
  }
  const raw = {
    name: str(form, "name"),
    email: str(form, "email"),
    phone: str(form, "phone"),
    date: str(form, "date"),
    place: str(form, "place"),
    time: str(form, "time"),
    guests: str(form, "guests"),
    eventType: str(form, "eventType"),
    services: form.getAll("services").filter((v): v is string => typeof v === "string"),
    message: str(form, "message"),
    privacy: form.get("privacy") ?? undefined,
  };
  const result = schema.safeParse(raw);
  if (result.success) return { ok: true, data: result.data };

  const errors: Partial<Record<FieldName, FieldError>> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as FieldName | undefined;
    if (!field || errors[field]) continue;
    errors[field] = (issue.message as FieldError) ?? "required";
  }
  return { ok: false, spam: false, errors };
}
