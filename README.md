# Tall i a Taula — web

Web de **Joan, tallador de pernil per a casaments i esdeveniments**. Next.js 16 (App Router), TypeScript y CSS Modules, en catalán (`/ca`) y castellano (`/es`).

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # y rellena los valores
npm run dev                  # http://localhost:3000
```

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` / `npm start` | Build de producción y servidor |
| `npm test` | Tests (validación del formulario y envío) |
| `npm run lint` | ESLint |

## Variables de entorno

Ver [`.env.example`](.env.example).

- **Formulario de presupuesto:** `RESEND_API_KEY`, `CONTACT_TO_EMAIL` y `CONTACT_FROM_EMAIL`. El remitente debe pertenecer a un dominio verificado en [Resend](https://resend.com) (p. ej. `talliataula.com`). Si faltan, el formulario avisa al visitante y le ofrece WhatsApp.
- **Datos legales** (aviso legal y privacidad): `NEXT_PUBLIC_TITULAR_NOMBRE`, `NEXT_PUBLIC_TITULAR_NIF`, `NEXT_PUBLIC_TITULAR_DOMICILIO` y `NEXT_PUBLIC_CONTACTE_EMAIL`. Solo se muestran si están rellenados.
- `NEXT_PUBLIC_SITE_URL`: URL pública, usada en el sitemap, en el canonical y en Open Graph.

## Dónde está cada cosa

- `src/i18n/dictionaries/ca.ts` y `es.ts`: **todos los textos** de la web.
- `src/config/site.ts`: teléfono, WhatsApp e Instagram.
- `src/lib/gallery.ts`: fotos de la galería y sus textos alternativos.
- `src/components/`: una sección por componente, cada una con su `.module.css`.
- `src/styles/globals.css`: colores, tipografía, botones y textura de papel.
- `src/app/actions/contacte.ts`: envío del formulario (Server Action con Resend).
- `src/proxy.ts`: redirige `/` a `/ca` o `/es` según el idioma del navegador.

## Imágenes

Las fotos originales están en `contenido/fotos-originales/` y no se publican (ignoradas en git). Para la web se generan versiones optimizadas:

```bash
python scripts/extraer_ilustraciones.py   # ilustraciones del dossier PDF -> contenido/ilustraciones-dossier/
python scripts/preparar_ilustraciones.py  # -> public/il/*.webp
python scripts/exportar_fotos.py          # -> public/fotos/*.webp y public/og.jpg
```

### Edición con IA (local)

`scripts/fotos_ia.py` usa **ComfyUI** en local (`http://127.0.0.1:8188`) con FLUX.2 Klein 4B:

```bash
# Foto vertical -> horizontal (se vuelve a pegar la foto original encima: el sujeto no se toca)
python scripts/fotos_ia.py ampliar IMG_2651 --prompt "Extend this photo into a wide landscape..."
# Eliminar un objeto solo dentro de una zona (fracciones x0,y0,x1,y1)
python scripts/fotos_ia.py limpiar IMG_2689 --zona 0.62,0.6,1,0.95 --zona-completa --prompt "Remove the trash bin..."
```

Los resultados van a `contenido/fotos-ia/`. `exportar_fotos.py` usa automáticamente la versión limpia de una foto cuando existe. Regla: la IA solo edita fotos reales. Nada de fotos ni testimonios inventados.

## Docker

```bash
cp .env.example .env.local     # rellenar (lo usa el build y el contenedor)
docker compose up -d --build   # http://127.0.0.1:3011
```

- Escucha solo en `127.0.0.1:3011`. Para exponerlo hace falta un proxy inverso (Nginx, Caddy, Traefik) con HTTPS para `talliataula.com`.
- `.env.local` llega al build como *secreto de BuildKit*, porque las variables `NEXT_PUBLIC_*` se incrustan en las páginas estáticas. No queda guardado en la imagen. En ejecución se carga con `env_file`.
- Si cambias una variable `NEXT_PUBLIC_*`, reconstruye con `--build`. Las de Resend basta con reiniciar: `docker compose up -d`.

### Estadísticas (Umami)

Estadísticas anónimas y sin cookies, así que no hace falta banner. Van en el mismo compose (`umami` + `umami-db`).

1. `cp umami.env.example umami.env` y rellenar las contraseñas y claves (`openssl rand -hex 32`). `umami.env` no se sube a git.
2. `docker compose up -d umami umami-db`. El panel queda en `http://127.0.0.1:3012`; publicarlo con el proxy inverso como `stats.talliataula.com`.
3. Entrar con `admin` / `umami` y **cambiar la contraseña enseguida**. Crear la web `talliataula.com` y copiar su *Website ID*.
4. Poner `NEXT_PUBLIC_UMAMI_WEBSITE_ID=<id>` en `.env.local` y reconstruir la web: `docker compose up -d --build web`.

La web sirve el script y recibe los envíos en su propio dominio (`/api/st/*`) y los reenvía a Umami por la red interna, así que los bloqueadores no los cortan. Solo cuenta visitas en `talliataula.com`, no en local. Eventos que se registran: `whatsapp` y `trucada` (con el lugar del botón: `pressupost`, `peu` o `flotant`), `instagram` y `sollicitud-enviada` (formulario enviado).

## Despliegue

Si no se usa Docker, lo recomendado es Vercel: importar el repositorio, añadir las variables de entorno y apuntar el dominio `talliataula.com`. Si se mantiene `talliataula.cat`, conviene redirigirlo con un 301 al `.com` para no duplicar contenido.

## Fase 2

Reservas con calendario. Diseño y decisiones de la fase 1: [`docs/superpowers/specs/2026-11-10-web-talliataula-design.md`](docs/superpowers/specs/2026-11-10-web-talliataula-design.md).
