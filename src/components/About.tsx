import Image from "next/image";
import type { Dictionary } from "@/i18n/dictionaries/ca";
import { Reveal } from "./Reveal";
import styles from "./About.module.css";

export function About({ dict }: { dict: Dictionary["about"] }) {
  return (
    <section className="section" id="qui-som">
      <div className={`container ${styles.grid}`}>
        <Reveal className={styles.photoCol}>
          <div className={styles.arch}>
            <Image
              src="/fotos/joan-concentrat.webp"
              alt={dict.photoAlt}
              fill
              sizes="(max-width: 860px) 86vw, 440px"
              style={{ objectFit: "cover", objectPosition: "50% 30%" }}
            />
          </div>
          <span className={styles.signature}>{dict.signature}</span>
          <Image className={styles.logo} src="/il/logo-joan.webp" alt="" width={648} height={662} sizes="130px" />
        </Reveal>

        <div>
          <Reveal>
            <span className="eyebrow">{dict.eyebrow}</span>
            <h2 className="section-title">{dict.title}</h2>
          </Reveal>
          {dict.paragraphs.map((p, i) => (
            <Reveal key={i} delay={0.08 * (i + 1)}>
              <p className={i === 1 ? styles.big : "lead"}>{p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
