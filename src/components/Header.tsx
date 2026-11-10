"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/ca";
import styles from "./Header.module.css";

type Props = { lang: Locale; dict: Dictionary["nav"]; homeOnly?: boolean };

export function Header({ lang, dict, homeOnly = false }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    // Se bloquea el scroll en <html>: hacerlo en <body> lo convierte en contenedor de scroll y rompe la cabecera fija.
    const root = document.documentElement;
    root.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      root.style.overflow = "";
    };
  }, [open]);

  const base = homeOnly ? `/${lang}` : "";
  const other: Locale = lang === "ca" ? "es" : "ca";

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.inner}`}>
        <Link href={`/${lang}`} className={styles.logo} aria-label="Tall i a Taula · Joan">
          <Image src="/il/logo-joan.webp" alt="" width={648} height={662} sizes="64px" />
          <span className={styles.logoText}>
            Tall i a Taula<small>{dict.tagline}</small>
          </span>
        </Link>

        <nav aria-label={dict.label} className={`${styles.nav} ${open ? styles.open : ""}`} id="menu-principal">
          <ul>
            {dict.items.map((item) => (
              <li key={item.href}>
                <a href={`${base}${item.href}`} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a href={`${base}#pressupost`} className={`btn btn-primary ${styles.cta}`} onClick={() => setOpen(false)}>
            {dict.cta}
          </a>
          <div className={styles.lang} aria-label={dict.langLabel} role="group">
            <span aria-current="true">{lang.toUpperCase()}</span>
            <Link href={`/${other}`} hrefLang={other} lang={other}>
              {other.toUpperCase()}
            </Link>
          </div>
        </nav>

        <button
          type="button"
          className={styles.burger}
          aria-expanded={open}
          aria-controls="menu-principal"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? dict.close : dict.menu}</span>
          <span aria-hidden="true" className={styles.burgerLines} />
        </button>
      </div>
    </header>
  );
}
