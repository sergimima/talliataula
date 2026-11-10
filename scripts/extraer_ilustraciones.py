"""Extrae las ilustraciones (PNG con transparencia) del dossier PDF a public/il/.
Uso: python scripts/extraer_ilustraciones.py
"""
import pathlib, pymupdf

ROOT = pathlib.Path(__file__).resolve().parent.parent
PDF = ROOT / "contenido" / "Tall i a taula - Dossier (1).pdf"
OUT = ROOT / "contenido" / "ilustraciones-dossier"
OUT.mkdir(parents=True, exist_ok=True)

doc = pymupdf.open(PDF)
seen = set()
for page in doc:
    for img in page.get_images(full=True):
        xref, smask = img[0], img[1]
        if xref in seen:
            continue
        seen.add(xref)
        pix = pymupdf.Pixmap(doc, xref)
        if smask:
            mask = pymupdf.Pixmap(doc, smask)
            pix = pymupdf.Pixmap(pix, mask)
        if pix.n - pix.alpha >= 4:  # CMYK -> RGB
            pix = pymupdf.Pixmap(pymupdf.csRGB, pix)
        name = OUT / f"p{page.number + 1}_x{xref}_{pix.width}x{pix.height}.png"
        pix.save(name)
        print(name.name)
