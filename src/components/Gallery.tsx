"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/ca";
import type { GalleryPhoto } from "@/lib/gallery";
import styles from "./Gallery.module.css";

type Props = { lang: Locale; dict: Dictionary["gallery"]; photos: GalleryPhoto[] };

const TILTS = [-2.5, 1.8, -1.2, 2.6, -1.8, 1.2, -2.2, 2, -1, 1.6, -2.6, 1.4, -1.6, 2.2, -1.4];

export function Gallery({ lang, dict, photos }: Props) {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const open = (i: number, el: HTMLButtonElement) => {
    triggerRef.current = el;
    setIndex(i);
  };
  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) dialog.showModal();
    if (index === null && dialog.open) {
      dialog.close();
      triggerRef.current?.focus();
    }
  }, [index]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, step]);

  // Deslizar con el dedo en móvil
  const touchX = useRef<number | null>(null);

  const current = index === null ? null : photos[index];

  return (
    <section className={`section ${styles.section}`} id="galeria">
      <div className="container">
        <div className={styles.head}>
          <span className="eyebrow">{dict.eyebrow}</span>
          <h2 className="section-title">{dict.title}</h2>
          <p className="lead">{dict.lead}</p>
        </div>

        <ul className={styles.grid}>
          {photos.map((photo, i) => (
            <li key={photo.src} className={styles.item} style={{ ["--tilt" as string]: `${TILTS[i % TILTS.length]}deg` }}>
              <button type="button" className={styles.thumb} onClick={(e) => open(i, e.currentTarget)}>
                <Image
                  src={photo.src}
                  alt={photo.alt[lang]}
                  width={photo.width}
                  height={photo.height}
                  sizes="(max-width: 600px) 46vw, (max-width: 1000px) 31vw, 270px"
                  loading="lazy"
                />
                <span className="sr-only">{dict.open}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label={current ? current.alt[lang] : dict.title}
        onClose={close}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        onTouchStart={(e) => {
          touchX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        {current && index !== null && (
          <div className={styles.viewer}>
            <figure className={styles.big}>
              <Image
                key={current.src}
                src={current.src}
                alt={current.alt[lang]}
                width={current.width}
                height={current.height}
                sizes="(max-width: 700px) 92vw, 60vh"
                className={styles.bigImg}
              />
              <figcaption>
                {current.alt[lang]}
                <span className={styles.counter}>
                  {index + 1} {dict.counter} {photos.length}
                </span>
              </figcaption>
            </figure>
            <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={() => step(-1)} aria-label={dict.prev}>
              ‹
            </button>
            <button type="button" className={`${styles.nav} ${styles.next}`} onClick={() => step(1)} aria-label={dict.next}>
              ›
            </button>
            <button type="button" className={styles.close} onClick={close} aria-label={dict.close} autoFocus>
              ×
            </button>
          </div>
        )}
      </dialog>
    </section>
  );
}
