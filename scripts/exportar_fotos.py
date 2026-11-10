"""Genera las fotos para la web en public/fotos/ (WebP, máx. 1800 px) a partir de
contenido/fotos-originales/ y, cuando existe, de la versión editada en contenido/fotos-ia/.
También crea public/og.jpg (1200x630) para compartir en redes.
"""
import pathlib
from PIL import Image, ImageOps

ROOT = pathlib.Path(__file__).resolve().parent.parent
ORIG = ROOT / "contenido" / "fotos-originales"
IA = ROOT / "contenido" / "fotos-ia"
OUT = ROOT / "public" / "fotos"
OUT.mkdir(parents=True, exist_ok=True)

FOTOS = {
    "IMG_2647": "tall-primer-pla",
    "IMG_2649": "estacio-masia",
    "IMG_2651": "joan-tallant",
    "IMG_2652": "joan-tallant-2",
    "IMG_2653": "emplatant",
    "IMG_2655": "joan-concentrat",
    "IMG_2661": "taula-de-pernil",
    "IMG_2665": "taula-de-pernil-2",
    "IMG_2672": "tall-detall",
    "IMG_2673": "llesques-a-la-taula",
    "IMG_2674": "emplatant-2",
    "IMG_2677": "joan-i-la-taula",
    "IMG_2687": "taula-del-pica-pica",
    "IMG_2689": "convidats",
    "IMG_2691": "joan-i-el-pica-pica",
}
MAX = 1800

for stem, slug in FOTOS.items():
    edited = IA / f"{stem}-limpia-s7.jpg"
    src = Image.open(edited) if edited.exists() else ImageOps.exif_transpose(Image.open(ORIG / f"{stem}.jpeg"))
    im = src.convert("RGB")
    im.thumbnail((MAX, MAX), Image.LANCZOS)
    im.save(OUT / f"{slug}.webp", "WEBP", quality=80, method=6)
    print(slug, im.size, "(editada)" if edited.exists() else "")

hero = Image.open(IA / "IMG_2651-horizontal-hero.jpg").convert("RGB")
hero.save(OUT / "hero-joan.webp", "WEBP", quality=85, method=6)
print("hero-joan", hero.size)

w, h = hero.size
th = round(w * 630 / 1200)
og = hero.crop((0, (h - th) // 2, w, (h - th) // 2 + th)).resize((1200, 630), Image.LANCZOS)
og.save(ROOT / "public" / "og.jpg", quality=86)
print("og.jpg", og.size)
