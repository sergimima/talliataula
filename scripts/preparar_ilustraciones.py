"""Copia las ilustraciones útiles del dossier a public/il/ en WebP con nombres legibles.
Requiere haber ejecutado antes scripts/extraer_ilustraciones.py.
"""
import pathlib
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "contenido" / "ilustraciones-dossier"
OUT = ROOT / "public" / "il"
OUT.mkdir(parents=True, exist_ok=True)

MAPA = {
    "p1_x153_753x753.png": "logo-joan",
    "p1_x154_1518x608.png": "romer",
    "p2_x161_813x1107.png": "marc-verd",
    "p3_x169_343x441.png": "oli",
    "p3_x171_652x647.png": "tomaquets",
    "p3_x173_462x346.png": "pernil-llesques",
    "p3_x286_502x372.png": "pa",
    "p4_x178_914x497.png": "pernil",
    "p4_x183_377x377.png": "amics",
    "p6_x197_250x263.png": "nota-quadricula",
    "p6_x202_776x792.png": "paper-rodo",
    "p7_x337_1400x544.png": "paper-esquincat",
}

for src, name in MAPA.items():
    im = Image.open(SRC / src).convert("RGBA")
    bbox = im.getchannel("A").getbbox()
    if bbox:
        im = im.crop(bbox)
    im.save(OUT / f"{name}.webp", "WEBP", quality=88, method=6)
    print(f"{name}.webp {im.width}x{im.height}")
