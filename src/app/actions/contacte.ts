"use server";

import { Resend } from "resend";
import { parseContactForm } from "@/lib/contact-schema";
import type { FieldError, FieldName } from "@/lib/contact-constants";
import { buildContactEmail } from "@/lib/contact-email";
import { hasLocale } from "@/i18n/config";

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      code: "form" | "config" | "send";
      errors: Partial<Record<FieldName, FieldError>>;
      values: Record<string, string | string[]>;
    };

function snapshot(form: FormData): Record<string, string | string[]> {
  const values: Record<string, string | string[]> = {};
  for (const key of ["name", "email", "phone", "date", "place", "time", "guests", "eventType", "message"]) {
    const v = form.get(key);
    values[key] = typeof v === "string" ? v : "";
  }
  values.services = form.getAll("services").filter((v): v is string => typeof v === "string");
  values.privacy = form.get("privacy") === "on" ? "on" : "";
  return values;
}

export async function enviarSollicitud(_prev: ContactState, form: FormData): Promise<ContactState> {
  const locale = String(form.get("locale") ?? "ca");
  const parsed = parseContactForm(form);

  if (!parsed.ok) {
    // A los robots les respondemos como si hubiera ido bien, sin enviar nada.
    if (parsed.spam) return { status: "success" };
    return { status: "error", code: "form", errors: parsed.errors, values: snapshot(form) };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    console.error("[contacte] Falta configurar RESEND_API_KEY, CONTACT_TO_EMAIL o CONTACT_FROM_EMAIL");
    return { status: "error", code: "config", errors: {}, values: snapshot(form) };
  }

  const { subject, text } = buildContactEmail(parsed.data, hasLocale(locale) ? locale : "ca");
  try {
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to: to.split(",").map((s) => s.trim()).filter(Boolean),
      replyTo: parsed.data.email,
      subject,
      text,
    });
    if (error) {
      console.error("[contacte] Resend ha retornat un error", error);
      return { status: "error", code: "send", errors: {}, values: snapshot(form) };
    }
  } catch (err) {
    console.error("[contacte] Error enviant el correu", err);
    return { status: "error", code: "send", errors: {}, values: snapshot(form) };
  }
  return { status: "success" };
}
