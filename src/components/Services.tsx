import Image from "next/image";
import type { Dictionary } from "@/i18n/dictionaries/ca";
import { Reveal } from "./Reveal";
import styles from "./Services.module.css";

function Illustration({ kind }: { kind: string }) {
  if (kind === "pernil") {
    return <Image src="/il/pernil.webp" alt="" width={914} height={497} sizes="220px" className={styles.ilWide} />;
  }
  if (kind === "pa-amb-tomaquet") {
    return (
      <div className={styles.combo}>
        <Image src="/il/pa.webp" alt="" width={502} height={372} sizes="150px" className={styles.comboPa} />
        <Image src="/il/tomaquets.webp" alt="" width={652} height={647} sizes="100px" className={styles.comboTom} />
        <Image src="/il/oli.webp" alt="" width={343} height={441} sizes="80px" className={styles.comboOli} />
      </div>
    );
  }
  return <Image src="/il/amics.webp" alt="" width={377} height={377} sizes="190px" className={styles.ilRound} />;
}

export function Services({ dict }: { dict: Dictionary["services"] }) {
  return (
    <section className="section" id="serveis">
      <div className="container">
        <Reveal className={styles.head}>
          <span className="eyebrow">{dict.eyebrow}</span>
          <h2 className="section-title">{dict.title}</h2>
        </Reveal>
        <ul className={styles.list}>
          {dict.items.map((item, i) => (
            <Reveal as="li" key={item.title} delay={0.1 * i} className={styles.card}>
              <div className={styles.illustration}>
                <Illustration kind={item.illustration} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              {item.note && <span className={styles.note}>{item.note}</span>}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
