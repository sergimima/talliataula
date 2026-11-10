import Image from "next/image";
import type { Dictionary } from "@/i18n/dictionaries/ca";
import { Reveal } from "./Reveal";
import styles from "./Hero.module.css";

type Props = { dict: Dictionary["hero"]; strip: Dictionary["strip"] };

export function Hero({ dict, strip }: Props) {
  return (
    <>
      <section className={styles.hero} id="inici">
        <Image className={`${styles.romer} ${styles.romer1}`} src="/il/romer.webp" alt="" width={1518} height={608} sizes="220px" />
        <div className={`container ${styles.grid}`}>
          <div className={styles.text}>
            <p className={styles.kicker}>{dict.kicker}</p>
            <h1 className={styles.title}>
              {dict.titleA}
              <br />
              {dict.titleB} <span className="marker">{dict.titleHighlight}</span>.
            </h1>
            <p className={`lead ${styles.lead}`}>{dict.lead}</p>
            <div className={styles.actions}>
              <a href="#pressupost" className="btn btn-primary">
                {dict.cta}
              </a>
              <a href="#galeria" className="btn btn-ghost">
                {dict.secondary}
              </a>
            </div>
          </div>

          <div className={styles.photos}>
            <figure className={`${styles.polaroid} ${styles.main}`}>
              <span className={styles.tape} aria-hidden="true" />
              <div className={styles.photoBox}>
                <Image
                  src="/fotos/hero-joan.webp"
                  alt={dict.altMain}
                  fill
                  priority
                  sizes="(max-width: 860px) 92vw, 620px"
                  style={{ objectFit: "cover", objectPosition: "54% 40%" }}
                />
              </div>
              <figcaption>{dict.captionMain}</figcaption>
            </figure>
            <Reveal className={styles.smallWrap} delay={0.35}>
              <figure className={`${styles.polaroid} ${styles.small}`}>
                <div className={styles.photoBox}>
                  <Image
                    src="/fotos/taula-de-pernil.webp"
                    alt={dict.altSmall}
                    fill
                    sizes="(max-width: 860px) 44vw, 240px"
                    style={{ objectFit: "cover", objectPosition: "50% 45%" }}
                  />
                </div>
                <figcaption>{dict.captionSmall}</figcaption>
              </figure>
            </Reveal>
            <Image className={styles.tomaquets} src="/il/tomaquets.webp" alt="" width={652} height={647} sizes="120px" />
          </div>
        </div>
      </section>

      <div className={styles.strip}>
        <ul className={styles.stripList}>
          {[...strip, ...strip].map((item, i) => (
            <li key={i} aria-hidden={i >= strip.length ? true : undefined}>
              <span className={styles.flower} aria-hidden="true">✿</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
