import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/ca";
import { whatsappUrl } from "@/lib/whatsapp";
import styles from "./Footer.module.css";

type Props = { lang: Locale; dict: Dictionary };

export function Footer({ lang, dict }: Props) {
  const other: Locale = lang === "ca" ? "es" : "ca";
  return (
    <footer className={styles.footer}>
      <div className={styles.torn} aria-hidden="true" />
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <Image src="/il/logo-joan.webp" alt="Tall i a Taula · Joan" width={648} height={662} sizes="120px" className={styles.logo} />
          <p className={styles.motto}>{dict.footer.motto}</p>
          <Image src="/il/romer.webp" alt="" width={1518} height={608} sizes="140px" className={styles.romer} />
        </div>
        <div>
          <h2 className={styles.h}>{dict.footer.contact}</h2>
          <ul className={styles.list}>
            <li>
              <a href={site.phoneHref} data-umami-event="trucada" data-umami-event-lloc="peu">
                {site.phone}
              </a>
            </li>
            <li>
              <a
                href={whatsappUrl(dict.quote.whatsappText)}
                target="_blank"
                rel="noopener noreferrer"
                data-umami-event="whatsapp"
                data-umami-event-lloc="peu"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" data-umami-event="instagram">
                Instagram {site.instagram.handle}
              </a>
            </li>
            <li>
              <a href={site.googleMaps} target="_blank" rel="noopener noreferrer">
                Google Maps
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className={styles.h}>{dict.footer.legal}</h2>
          <ul className={styles.list}>
            <li>
              <Link href={`/${lang}/privacitat`}>{dict.footer.privacy}</Link>
            </li>
            <li>
              <Link href={`/${lang}/avis-legal`}>{dict.footer.notice}</Link>
            </li>
            <li>
              <Link href={`/${other}`} hrefLang={other} lang={other}>
                {other === "es" ? "Castellano" : "Català"}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className={`container ${styles.copy}`}>
        © {site.name} · {site.person}. {dict.footer.rights}
      </p>
    </footer>
  );
}
