import Image from "next/image";
import { site } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/ca";
import { whatsappUrl } from "@/lib/whatsapp";
import { QuoteForm } from "./QuoteForm";
import { Reveal } from "./Reveal";
import styles from "./Quote.module.css";

export function Quote({ lang, dict }: { lang: Locale; dict: Dictionary["quote"] }) {
  const wa = whatsappUrl(dict.whatsappText);
  return (
    <section className={`section ${styles.section}`} id="pressupost">
      <div className={`container ${styles.grid}`}>
        <div className={styles.side}>
          <Reveal>
            <span className="eyebrow">{dict.eyebrow}</span>
            <h2 className="section-title">{dict.title}</h2>
            <p className="lead">{dict.lead}</p>
          </Reveal>

          <Reveal className={styles.needs} rotate={3} delay={0.1}>
            <h3>{dict.needsTitle}</h3>
            <ul>
              {dict.needs.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            <Image className={styles.needsRomer} src="/il/romer.webp" alt="" width={1518} height={608} sizes="120px" />
          </Reveal>

          <Reveal className={styles.direct} delay={0.15}>
            <h3>{dict.orTitle}</h3>
            <div className={styles.directButtons}>
              <a className="btn btn-green" href={wa} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon />
                {dict.whatsapp}
              </a>
              <a className="btn btn-ghost" href={site.phoneHref}>
                {dict.call}: {site.phone}
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal className={styles.formCard} delay={0.05}>
          <QuoteForm lang={lang} dict={dict} whatsappHref={wa} />
        </Reveal>
      </div>
    </section>
  );
}

export function WhatsAppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.86 9.86 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29Z" />
    </svg>
  );
}
