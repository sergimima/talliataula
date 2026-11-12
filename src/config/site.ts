/**
 * Datos del negocio. Todo lo que se muestra en la web y en los datos estructurados sale de aquí.
 * `titular` son los datos legales del responsable (aviso legal y privacidad). Son públicos;
 * las variables de entorno solo sirven para sobrescribirlos sin tocar el código.
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
  /** Ficha de Google Business Profile (Google Maps). */
  googleMaps: "https://maps.google.com/?cid=7140626089178580949",
  titular: {
    nombreLegal: process.env.NEXT_PUBLIC_TITULAR_NOMBRE || "Joan Jawo Marquez",
    // NIF y domicilio sin valor por defecto: solo se muestran si se rellenan las variables.
    nif: process.env.NEXT_PUBLIC_TITULAR_NIF || "",
    domicilio: process.env.NEXT_PUBLIC_TITULAR_DOMICILIO || "",
    email: process.env.NEXT_PUBLIC_CONTACTE_EMAIL || "joanjjm6@gmail.com",
  },
} as const;
