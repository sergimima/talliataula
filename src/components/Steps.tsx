import type { Dictionary } from "@/i18n/dictionaries/ca";
import { Reveal } from "./Reveal";
import styles from "./Steps.module.css";

export function Steps({ dict }: { dict: Dictionary["steps"] }) {
  return (
    <section className="section" id="com-funciona">
      <div className="container">
        <Reveal className={styles.head}>
          <h2 className="section-title">{dict.eyebrow}</h2>
        </Reveal>
        <ol className={styles.list}>
          {dict.items.map((item, i) => (
            <Reveal as="li" key={item.title} delay={0.1 * i} className={styles.step}>
              <span className={styles.num} aria-hidden="true">
                {i + 1}
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
