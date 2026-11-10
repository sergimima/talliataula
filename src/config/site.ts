/**
 * Datos del negocio. Todo lo que se muestra en la web y en los datos estructurados sale de aquí.
 * Los campos de `titular` son los datos legales del responsable (aviso legal y privacidad):
 * se muestran solo si están rellenados.
 */
export const site = {
  name: "Tall i a Taula",
  person: "Joan",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://talliataula.com",
  phone: "+34 675 079 606",
  phoneHref: "tel:+34675079606",
  whatsapp: "34675079606",
  /** Zona de servicio (datos estructurados para Google). */
  areaServed: "Catalunya",
  instagram: {
    handle: "@Talliataula",
    url: "https://www.instagram.com/Talliataula",
  },
  titular: {
    nombreLegal: process.env.NEXT_PUBLIC_TITULAR_NOMBRE ?? "",
    nif: process.env.NEXT_PUBLIC_TITULAR_NIF ?? "",
    domicilio: process.env.NEXT_PUBLIC_TITULAR_DOMICILIO ?? "",
    email: process.env.NEXT_PUBLIC_CONTACTE_EMAIL ?? "",
  },
} as const;
