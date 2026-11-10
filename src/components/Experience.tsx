import Image from "next/image";
import type { Dictionary } from "@/i18n/dictionaries/ca";
import { Reveal } from "./Reveal";
import styles from "./Experience.module.css";

export function Experience({ dict }: { dict: Dictionary["experience"] }) {
  return (
    <section className={`section ${styles.section}`} id="experiencia">
      <div className={`container ${styles.grid}`}>
        <div className={styles.text}>
          <Reveal>
            <span className="eyebrow">{dict.eyebrow}</span>
            <h2 className="section-title">{dict.title}</h2>
          </Reveal>
          {dict.paragraphs.map((p, i) => (
            <Reveal key={i} delay={0.08 * (i + 1)}>
              <p className="lead">{p}</p>
            </Reveal>
          ))}
        </div>

        <div className={styles.visual}>
          <Reveal className={styles.frameWrap} rotate={-3}>
            <div className={styles.frame}>
              <Image className={styles.frameArt} src="/il/marc-verd.webp" alt="" fill sizes="(max-width: 860px) 80vw, 420px" />
              <div className={styles.photo}>
                <Image
                  src="/fotos/tall-detall.webp"
                  alt={dict.photoAlt}
                  fill
                  sizes="(max-width: 860px) 64vw, 330px"
                  style={{ objectFit: "cover", objectPosition: "50% 40%" }}
                />
              </div>
            </div>
          </Reveal>
          <Image className={`${styles.ing} ${styles.pa}`} src="/il/pa.webp" alt="" width={502} height={372} sizes="170px" />
          <Image className={`${styles.ing} ${styles.pernil}`} src="/il/pernil-llesques.webp" alt="" width={462} height={346} sizes="160px" />
          <Image className={`${styles.ing} ${styles.oli}`} src="/il/oli.webp" alt="" width={343} height={441} sizes="110px" />
          <Image className={`${styles.ing} ${styles.tom}`} src="/il/tomaquets.webp" alt="" width={652} height={647} sizes="120px" />
        </div>
      </div>
    </section>
  );
}
