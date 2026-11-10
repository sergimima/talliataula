"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { enviarSollicitud, type ContactState } from "@/app/actions/contacte";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/ca";
import { EVENT_TYPES, SERVICES, todayISO, type FieldName } from "@/lib/contact-constants";
import styles from "./QuoteForm.module.css";

type Props = { lang: Locale; dict: Dictionary["quote"]; whatsappHref: string };

const initial: ContactState = { status: "idle" };

export function QuoteForm({ lang, dict, whatsappHref }: Props) {
  const [state, action, pending] = useActionState(enviarSollicitud, initial);
  const dateRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const f = dict.form;

  // La fecha mínima se calcula en el navegador (la página es estática).
  useEffect(() => {
    dateRef.current?.setAttribute("min", todayISO());
  });

  useEffect(() => {
    if (state.status !== "idle") statusRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div className={styles.success} ref={statusRef} tabIndex={-1} role="status">
        <svg viewBox="0 0 64 64" aria-hidden="true" className={styles.successIcon}>
          <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="4 7" strokeLinecap="round" />
          <path d="M19 33c4 3 7 6 9 9 5-10 11-17 18-22" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3>{dict.success.title}</h3>
        <p>{dict.success.text}</p>
        <a className="btn btn-green" href={whatsappHref} target="_blank" rel="noopener noreferrer">
          {dict.whatsapp}
        </a>
      </div>
    );
  }

  const errors = state.status === "error" ? state.errors : {};
  const values = state.status === "error" ? state.values : {};
  const v = (k: string) => (typeof values[k] === "string" ? (values[k] as string) : "");
  const selectedServices = Array.isArray(values.services) ? values.services : ["tall"];
  const err = (k: FieldName) => (errors[k] ? dict.errors[errors[k]!] : undefined);
  // Remonta el formulario tras cada error para que conserve lo que se había escrito.
  const formKey = state.status === "error" ? JSON.stringify(values) : "fresh";

  return (
    <form action={action} className={styles.form} noValidate key={formKey}>
      <input type="hidden" name="locale" value={lang} />
      {/* Campo trampa para robots: invisible para las personas */}
      <div className={styles.trap} aria-hidden="true">
        <label>
          Web
          <input type="text" name="web" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div ref={statusRef} tabIndex={-1} className={styles.statusAnchor}>
        {state.status === "error" && (
          <p className={styles.formError} role="alert">
            {state.code === "form" ? dict.errors.form : state.code === "config" ? dict.errors.config : dict.errors.send}
            {state.code !== "form" && (
              <>
                {" "}
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  {dict.whatsapp}
                </a>
              </>
            )}
          </p>
        )}
      </div>

      <div className={styles.row}>
        <Field id="name" label={f.name} required requiredLabel={f.required} error={err("name")}>
          <input id="name" name="name" type="text" autoComplete="name" required maxLength={120} defaultValue={v("name")} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-err" : undefined} />
        </Field>
        <Field id="email" label={f.email} required requiredLabel={f.required} error={err("email")}>
          <input id="email" name="email" type="email" autoComplete="email" required maxLength={200} defaultValue={v("email")} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-err" : undefined} />
        </Field>
      </div>

      <Field id="phone" label={f.phone} hint={f.phoneHint} error={err("phone")}>
        <input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={40} defaultValue={v("phone")} aria-describedby="phone-hint" />
      </Field>

      <div className={styles.row}>
        <Field id="date" label={f.date} required requiredLabel={f.required} error={err("date")}>
          <input id="date" name="date" type="date" required ref={dateRef} defaultValue={v("date")} aria-invalid={!!errors.date} aria-describedby={errors.date ? "date-err" : undefined} />
        </Field>
        <Field id="guests" label={f.guests} required requiredLabel={f.required} error={err("guests")}>
          <input id="guests" name="guests" type="number" inputMode="numeric" min={1} max={5000} step={1} required defaultValue={v("guests")} aria-invalid={!!errors.guests} aria-describedby={errors.guests ? "guests-err" : undefined} />
        </Field>
      </div>

      <div className={styles.row}>
        <Field id="place" label={f.place} hint={f.placeHint} required requiredLabel={f.required} error={err("place")}>
          <input id="place" name="place" type="text" required maxLength={200} defaultValue={v("place")} aria-invalid={!!errors.place} aria-describedby={errors.place ? "place-err" : "place-hint"} />
        </Field>
        <Field id="time" label={f.time} hint={f.timeHint} error={err("time")}>
          <input id="time" name="time" type="text" maxLength={80} defaultValue={v("time")} aria-describedby="time-hint" />
        </Field>
      </div>

      <Field id="eventType" label={f.eventType}>
        <select id="eventType" name="eventType" defaultValue={v("eventType") || "casament"}>
          {EVENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {f.eventTypes[t]}
            </option>
          ))}
        </select>
      </Field>

      <fieldset className={styles.services}>
        <legend>{f.services}</legend>
        <div className={styles.chips}>
          {SERVICES.map((s) => (
            <label key={s} className={styles.chip}>
              <input type="checkbox" name="services" value={s} defaultChecked={selectedServices.includes(s)} />
              <span>{f.serviceOptions[s]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field id="message" label={f.message} hint={f.messageHint} error={err("message")}>
        <textarea id="message" name="message" rows={4} maxLength={3000} defaultValue={v("message")} aria-describedby="message-hint" />
      </Field>

      <div className={styles.privacy}>
        <label>
          <input type="checkbox" name="privacy" required defaultChecked={v("privacy") === "on"} aria-invalid={!!errors.privacy} aria-describedby={errors.privacy ? "privacy-err" : undefined} />
          <span>
            {f.privacyBefore}
            <Link href={`/${lang}/privacitat`} target="_blank">
              {f.privacyLink}
            </Link>
            {f.privacyAfter}
          </span>
        </label>
        {errors.privacy && (
          <p className={styles.error} id="privacy-err">
            {dict.errors[errors.privacy]}
          </p>
        )}
      </div>

      <button type="submit" className={`btn btn-primary ${styles.submit}`} disabled={pending}>
        {pending ? f.sending : f.submit}
      </button>
    </form>
  );
}

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  requiredLabel?: string;
  error?: string;
  children: React.ReactNode;
};

function Field({ id, label, hint, required, requiredLabel, error, children }: FieldProps) {
  return (
    <div className={`${styles.field} ${error ? styles.hasError : ""}`}>
      <label htmlFor={id}>
        {label}
        {required && (
          <span className={styles.req} title={requiredLabel}>
            {" "}*<span className="sr-only"> ({requiredLabel})</span>
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p className={styles.hint} id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className={styles.error} id={`${id}-err`}>
          {error}
        </p>
      )}
    </div>
  );
}
