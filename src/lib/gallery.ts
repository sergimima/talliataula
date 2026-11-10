import type { Locale } from "@/i18n/config";

export type GalleryPhoto = {
  src: string;
  width: number;
  height: number;
  alt: Record<Locale, string>;
};

const P = (slug: string, ca: string, es: string): GalleryPhoto => ({
  src: `/fotos/${slug}.webp`,
  width: 1012,
  height: 1800,
  alt: { ca, es },
});

/** Orden pensado para la galería: alterna a Joan, el producto y el ambiente. */
export const galleryPhotos: GalleryPhoto[] = [
  P("joan-tallant", "En Joan tallant pernil sota el para-sol", "Joan cortando jamón bajo la sombrilla"),
  P("taula-de-pernil", "Taula rodona plena de pernil tallat a mà", "Tabla redonda llena de jamón cortado a mano"),
  P("convidats", "Convidats servint-se pernil mentre en Joan talla", "Invitados sirviéndose jamón mientras Joan corta"),
  P("tall-detall", "Detall del ganivet tallant una llesca fina", "Detalle del cuchillo cortando una loncha fina"),
  P("joan-i-el-pica-pica", "En Joan amb la taula de pa amb tomàquet i pernil", "Joan con la mesa de pan con tomate y jamón"),
  P("llesques-a-la-taula", "Llesques col·locades sobre una taula de fusta", "Lonchas colocadas sobre una tabla de madera"),
  P("taula-del-pica-pica", "Taula llarga amb pernil, coca amb tomàquet i tomàquets", "Mesa larga con jamón, coca con tomate y tomates"),
  P("joan-concentrat", "En Joan concentrat en el tall", "Joan concentrado en el corte"),
  P("taula-de-pernil-2", "Taula de pernil acabada de servir", "Tabla de jamón recién servida"),
  P("estacio-masia", "Estació de tall muntada al jardí d'una masia", "Estación de corte montada en el jardín de una masía"),
  P("emplatant", "Mà col·locant llesques a la taula", "Mano colocando lonchas en la tabla"),
  P("joan-i-la-taula", "En Joan al costat de la taula plena", "Joan junto a la tabla llena"),
  P("emplatant-2", "Emplatant pernil amb cura", "Emplatando jamón con cuidado"),
  P("joan-tallant-2", "En Joan tallant amb el pernil al suport", "Joan cortando con el jamón en el soporte"),
  P("tall-primer-pla", "Primer pla de les mans tallant pernil", "Primer plano de las manos cortando jamón"),
];
