# Web Tall i a Taula — diseño (fase 1)

Fecha: 2026-11-10

## Intención
Joan es tallador de pernil para bodas y eventos y ha empezado hace poco (de momento, un solo cliente). La web existe para **traerle clientes**. Una pareja que prepara la boda de su vida tiene que entrar y pensar "ostia, quiero esto". Por eso lo primero es que la web sea **cálida y tenga buena vibra**. No puede parecer una plantilla genérica.

Sustituye a www.talliataula.cat, una landing estática de Aridane Systems. El dominio nuevo es **talliataula.com**.

## Fases
- **Fase 1 (este documento):** una landing que enamore, una galería de fotos reales y un formulario de presupuesto.
- **Fase 2 (futuro):** reservas con calendario. Por eso el stack es Next.js.

## Objetivos
- Que se perciba calidez, artesanía y la persona de Joan.
- Que pedir presupuesto sea muy fácil: formulario, WhatsApp o teléfono.
- Que se le pueda encontrar: SEO técnico correcto (metadatos, Open Graph, schema.org, sitemap y un robots que no bloquee).
- Catalán (idioma principal) y castellano.

## Fuera de alcance (fase 1)
Reservas y calendario, pagos, panel de administración, blog y CMS.

## Lo que no puede pasar
- Una estética genérica de "Tailwind por defecto".
- **Fotos, testimonios o cifras inventadas.** Solo hay un cliente, así que no hay testimonios hasta que existan de verdad.
- Que la IA altere a Joan o el producto en las fotos.

## Decisiones del usuario
- Next.js.
- Estilo: **dirección A, "casa de pueblo"**. Es la evolución de la identidad actual: paleta papel `#F4EFDF`, verde `#5E9A49`, terracota `#B8582B`, crema `#E6DCC1`; títulos en *Gochi Hand* y texto en *Mali*; acuarelas (romero, pan, aceite, tomate); fotos tipo polaroid con cinta; subrayado "a rotulador"; franja verde con lo que incluye el servicio; foto de Joan con su firma.
- La dirección B ("editorial") se guarda en `docs/propuestas/` por si sirve para otra cosa.
- IA solo para editar fotos reales, en local con ComfyUI y FLUX.2 Klein 4B: ampliar fotos verticales a 16:9 volviendo a pegar los píxeles originales del sujeto, y quitar elementos como los cubos de basura.
- Fase 1: formulario de contacto. Las reservas, en fase 2.

## Decisiones de Claude (revisables)
- **Stack:** Next.js 16 (App Router) con TypeScript. **CSS Modules y variables CSS**, sin Tailwind, para tener control total de la estética. Fuentes con `next/font`.
- **Idiomas:** rutas `/ca` (por defecto) y `/es` con diccionarios propios, sin librería externa. La raíz `/` redirige según `Accept-Language`, y si no hay coincidencia, a `/ca`. Etiquetas `hreflang`.
- **Formulario:** con Server Action, validación con zod en servidor y cliente, un campo trampa (honeypot) contra spam y envío por email con **Resend**. Variables de entorno: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`. Si falta la configuración, el formulario muestra un error claro y ofrece WhatsApp como alternativa.
  - Campos: nombre*, email*, teléfono, fecha del evento*, población/lugar*, horario, número aproximado de invitados*, tipo de evento (boda / empresa / celebración privada / otro), servicios (tall en directe, pa amb tomàquet, a mida), mensaje y consentimiento de privacidad*.
  - Al lado del formulario, un botón de WhatsApp con mensaje prellenado.
- **Trato:** "vosaltres" en toda la web, para corregir la mezcla de tú y vosotros que tiene la actual.
- **Botón principal:** "Expliqueu-nos el vostre dia" / "Contadnos vuestro día".
- **Secciones:** Inicio (hero 16:9) · Qui som (Joan) · L'experiència · Serveis · Què inclou (franja) · Galeria (lightbox accesible) · Com funciona (4 pasos) · Pressupost (formulario) · Pie de página. Páginas legales: privacidad y aviso legal.
- **Sin cookies ni analítica** en fase 1, así que no hace falta banner de cookies. Las fuentes se sirven desde el propio dominio con `next/font`.
- **Animaciones:** entrada suave de los elementos al aparecer, con IntersectionObserver. Se desactivan con `prefers-reduced-motion`.
- **Imágenes:** fotos originales en `contenido/fotos-originales/`, que no se publican. Un script genera las versiones web en `public/fotos/`. Las ilustraciones salen del dossier PDF (PNG transparentes) y van a `public/il/`.
- **Hosting recomendado:** Vercel (gratuito y nativo para Next.js).

## Pendiente de datos reales (no se inventa)
- **Zona de servicio** (comarcas o radio): mientras no la tengamos, el texto dice "ens desplacem allà on sigui el vostre esdeveniment".
- **Datos legales del titular** (nombre completo, NIF y domicilio) para el aviso legal y la privacidad: se leen de `src/config/site.ts`, y la página legal indica que faltan hasta que se rellenen.
- **Email de contacto** y cuenta de Resend.
- **Testimonios:** se añadirán cuando haya clientes que los den.
