"""Edición de fotos con IA local (ComfyUI + FLUX.2 Klein 4B).

Requisitos: ComfyUI arrancado en http://127.0.0.1:8188 con los modelos
  - diffusion_models/flux-2-klein-4b-fp8.safetensors
  - text_encoders/qwen_3_4b_fp8_mixed.safetensors
  - vae/flux2-vae.safetensors

Dos operaciones:
  ampliar  -> convierte una foto vertical en horizontal. La IA rellena los lados
              y después se vuelve a pegar la foto original encima (el sujeto
              conserva sus píxeles reales).
  limpiar  -> elimina un objeto (p. ej. un cubo de basura). Solo se sustituye la
              zona donde la IA ha cambiado algo de verdad; el resto de la foto
              mantiene sus píxeles originales.

Uso:
  python scripts/fotos_ia.py ampliar IMG_2651 --prompt "..." [--seed 7]
  python scripts/fotos_ia.py limpiar IMG_2689 --zona 0.55,0.55,1,1 --prompt "..." [--seed 7]
Los resultados van a contenido/fotos-ia/.
"""
from __future__ import annotations

import argparse
import io
import json
import pathlib
import time
import urllib.parse
import urllib.request
import uuid

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps

ROOT = pathlib.Path(__file__).resolve().parent.parent
ORIG = ROOT / "contenido" / "fotos-originales"
OUT = ROOT / "contenido" / "fotos-ia"
COMFY = "http://127.0.0.1:8188"


def workflow(image: str, prompt: str, w: int, h: int, seed: int, steps: int = 4) -> dict:
    return {
        "unet": {"class_type": "UNETLoader", "inputs": {"unet_name": "flux-2-klein-4b-fp8.safetensors", "weight_dtype": "default"}},
        "clip": {"class_type": "CLIPLoader", "inputs": {"clip_name": "qwen_3_4b_fp8_mixed.safetensors", "type": "flux2", "device": "default"}},
        "vae": {"class_type": "VAELoader", "inputs": {"vae_name": "flux2-vae.safetensors"}},
        "img": {"class_type": "LoadImage", "inputs": {"image": image}},
        "pos": {"class_type": "CLIPTextEncode", "inputs": {"text": prompt, "clip": ["clip", 0]}},
        "neg": {"class_type": "CLIPTextEncode", "inputs": {"text": "", "clip": ["clip", 0]}},
        "enc": {"class_type": "VAEEncode", "inputs": {"pixels": ["img", 0], "vae": ["vae", 0]}},
        "refp": {"class_type": "ReferenceLatent", "inputs": {"conditioning": ["pos", 0], "latent": ["enc", 0]}},
        "refn": {"class_type": "ReferenceLatent", "inputs": {"conditioning": ["neg", 0], "latent": ["enc", 0]}},
        "guider": {"class_type": "CFGGuider", "inputs": {"model": ["unet", 0], "positive": ["refp", 0], "negative": ["refn", 0], "cfg": 1.0}},
        "sampler": {"class_type": "KSamplerSelect", "inputs": {"sampler_name": "euler"}},
        "sched": {"class_type": "Flux2Scheduler", "inputs": {"steps": steps, "width": w, "height": h}},
        "latent": {"class_type": "EmptyFlux2LatentImage", "inputs": {"width": w, "height": h, "batch_size": 1}},
        "noise": {"class_type": "RandomNoise", "inputs": {"noise_seed": seed}},
        "sample": {"class_type": "SamplerCustomAdvanced", "inputs": {"noise": ["noise", 0], "guider": ["guider", 0], "sampler": ["sampler", 0], "sigmas": ["sched", 0], "latent_image": ["latent", 0]}},
        "dec": {"class_type": "VAEDecode", "inputs": {"samples": ["sample", 0], "vae": ["vae", 0]}},
        "save": {"class_type": "SaveImage", "inputs": {"images": ["dec", 0], "filename_prefix": "talliataula/fotos_ia"}},
    }


def upload(im: Image.Image, name: str) -> str:
    buf = io.BytesIO()
    im.save(buf, "PNG")
    boundary = uuid.uuid4().hex
    body = (
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"image\"; filename=\"{name}\"\r\n"
        "Content-Type: image/png\r\n\r\n"
    ).encode() + buf.getvalue() + f"\r\n--{boundary}\r\nContent-Disposition: form-data; name=\"overwrite\"\r\n\r\ntrue\r\n--{boundary}--\r\n".encode()
    req = urllib.request.Request(f"{COMFY}/upload/image", body, {"Content-Type": f"multipart/form-data; boundary={boundary}"})
    return json.load(urllib.request.urlopen(req))["name"]


def generate(im: Image.Image, prompt: str, w: int, h: int, seed: int) -> Image.Image:
    name = upload(im, f"tt_{uuid.uuid4().hex[:8]}.png")
    body = json.dumps({"prompt": workflow(name, prompt, w, h, seed)}).encode()
    req = urllib.request.Request(f"{COMFY}/prompt", body, {"Content-Type": "application/json"})
    pid = json.load(urllib.request.urlopen(req))["prompt_id"]
    t0 = time.time()
    while time.time() - t0 < 900:
        hist = json.load(urllib.request.urlopen(f"{COMFY}/history/{pid}"))
        if pid in hist:
            entry = hist[pid]
            if entry["status"].get("status_str") != "success":
                raise RuntimeError(f"ComfyUI falló: {entry['status']}")
            img = next(iter(entry["outputs"].values()))["images"][0]
            q = urllib.parse.urlencode({"filename": img["filename"], "subfolder": img["subfolder"], "type": img["type"]})
            return Image.open(io.BytesIO(urllib.request.urlopen(f"{COMFY}/view?{q}").read())).convert("RGB")
        time.sleep(2)
    raise TimeoutError("ComfyUI no respondió en 15 minutos")


def load(stem: str) -> Image.Image:
    return ImageOps.exif_transpose(Image.open(ORIG / f"{stem}.jpeg")).convert("RGB")


def ampliar(stem: str, prompt: str, seed: int, w: int = 1920, h: int = 1088) -> pathlib.Path:
    src = load(stem)
    fw = round(src.width * h / src.height)
    fg = src.resize((fw, h), Image.LANCZOS)
    x = (w - fw) // 2
    canvas = Image.new("RGB", (w, h), (128, 128, 128))
    canvas.paste(fg, (x, 0))
    gen = generate(canvas, prompt, w, h, seed)
    feather = 48
    mask = Image.new("L", fg.size, 0)
    ImageDraw.Draw(mask).rectangle((feather, 0, fw - feather, h), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(feather / 2))
    gen.paste(fg, (x, 0), mask)
    out = OUT / f"{stem}-horizontal-s{seed}.jpg"
    gen.save(out, quality=92)
    return out


def limpiar(stem: str, prompt: str, seed: int, zona: tuple[float, float, float, float],
            zona_completa: bool = False, w: int = 768, h: int = 1360) -> pathlib.Path:
    """zona = (x0, y0, x1, y1) en fracciones de la imagen: único rectángulo que se puede modificar."""
    src = load(stem)
    work = src.resize((1440, 2560), Image.LANCZOS)
    gen = generate(src.resize((w, h), Image.LANCZOS), prompt, w, h, seed).resize(work.size, Image.LANCZOS)
    # Zona cambiada: diferencia entre versiones suavizadas, umbral alto y limpieza de ruido.
    diff = ImageChops.difference(work.filter(ImageFilter.GaussianBlur(6)), gen.filter(ImageFilter.GaussianBlur(6))).convert("L")
    mask = diff.point(lambda v: 255 if v > 38 else 0)
    # Solo dentro de la zona permitida.
    allowed = Image.new("L", work.size, 0)
    x0, y0, x1, y1 = zona
    ImageDraw.Draw(allowed).rectangle((x0 * work.width, y0 * work.height, x1 * work.width, y1 * work.height), fill=255)
    if zona_completa:
        # Se sustituye todo el rectángulo (útil cuando el objeto se parece al fondo y la diferencia no lo detecta entero).
        mask = allowed
    else:
        mask = ImageChops.multiply(mask, allowed)
        # Quitar ruido y cerrar huecos (evita manchas mezcladas).
        mask = mask.filter(ImageFilter.MinFilter(9)).filter(ImageFilter.MaxFilter(81)).filter(ImageFilter.MinFilter(41))
    mask = mask.filter(ImageFilter.GaussianBlur(14))
    result = Image.composite(gen, work, mask)
    out = OUT / f"{stem}-limpia-s{seed}.jpg"
    result.save(out, quality=92)
    mask.save(OUT / f"{stem}-limpia-s{seed}-mascara.png")
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("op", choices=["ampliar", "limpiar"])
    ap.add_argument("foto", help="nombre sin extensión, p. ej. IMG_2651")
    ap.add_argument("--prompt", required=True)
    ap.add_argument("--seed", type=int, default=7)
    ap.add_argument("--zona", help="limpiar: x0,y0,x1,y1 en fracciones (0-1) de la zona a modificar")
    ap.add_argument("--zona-completa", action="store_true", help="limpiar: sustituir el rectángulo entero, no solo lo que cambia")
    a = ap.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    if a.op == "ampliar":
        print(ampliar(a.foto, a.prompt, a.seed))
    else:
        if not a.zona:
            ap.error("limpiar necesita --zona x0,y0,x1,y1")
        zona = tuple(float(v) for v in a.zona.split(","))
        if len(zona) != 4:
            ap.error("--zona necesita 4 valores")
        print(limpiar(a.foto, a.prompt, a.seed, zona, a.zona_completa))  # type: ignore[arg-type]


if __name__ == "__main__":
    main()
