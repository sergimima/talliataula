import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/ca";
import { Footer } from "./Footer";
import { Header } from "./Header";
import styles from "./LegalPage.module.css";

type Props = { lang: Locale; dict: Dictionary; title: string; children: ReactNode };

export function LegalPage({ lang, dict, title, children }: Props) {
  return (
    // Contenedor en flujo normal como referencia de scroll al navegar (ver app/[lang]/page.tsx).
    <div className="page">
      <Header lang={lang} dict={dict.nav} homeOnly />
      <main className={`container ${styles.main}`}>
        <Link href={`/${lang}`} className={styles.back}>
          ← {dict.legal.back}
        </Link>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.body}>{children}</div>
      </main>
      <Footer lang={lang} dict={dict} />
    </div>
  );
}

/** Datos identificativos del titular: solo muestra los que están configurados. */
export function OwnerData({ heading }: { heading: string }) {
  const t = site.titular;
  return (
    <>
      <h2>{heading}</h2>
      <ul>
        <li>
          {t.nombreLegal || site.person} — {site.name}
        </li>
        {t.nif && <li>NIF: {t.nif}</li>}
        {t.domicilio && <li>{t.domicilio}</li>}
        <li>
          Tel.: <a href={site.phoneHref}>{site.phone}</a>
        </li>
        {t.email && (
          <li>
            Email: <a href={`mailto:${t.email}`}>{t.email}</a>
          </li>
        )}
        <li>Web: {site.url.replace(/^https?:\/\//, "")}</li>
      </ul>
    </>
  );
}
