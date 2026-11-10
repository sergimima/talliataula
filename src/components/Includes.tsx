import Image from "next/image";
import type { Dictionary } from "@/i18n/dictionaries/ca";
import { Reveal } from "./Reveal";
import styles from "./Includes.module.css";

export function Includes({ dict }: { dict: Dictionary["includes"] }) {
  return (
    <section className={styles.section} aria-labelledby="inclou-titol">
      <div className={`container ${styles.inner}`}>
        <div className={styles.paper}>
          <Reveal>
            <h2 id="inclou-titol" className={styles.title}>
              {dict.eyebrow}
            </h2>
          </Reveal>
          <ul className={styles.list}>
            {dict.items.map((item, i) => (
              <Reveal as="li" key={item.title} delay={0.07 * i} className={styles.item}>
                <svg className={styles.check} viewBox="0 0 32 32" aria-hidden="true">
                  <path d="M5 17.5c3 2.2 5.4 5 7 7.5C15.5 17 20.5 10.5 27 5.5" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
          <Image className={styles.romer} src="/il/romer.webp" alt="" width={1518} height={608} sizes="200px" />
        </div>
      </div>
    </section>
  );
}
