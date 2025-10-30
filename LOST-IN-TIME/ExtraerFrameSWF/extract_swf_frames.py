#!/usr/bin/env python3
# -*- coding: utf-8 -*-


"""
extract_swf_frames.py

Extrae frames PNG desde archivos SWF usando uno de estos motores:
  - FFmpeg (si el SWF contiene video embebido)
  - JPEXS Free Flash Decompiler (ffdec.jar o ffdec.bat, exporta frames del timeline)
  - SWFTools: swfrender + swfdump (renderiza cada frame de la línea de tiempo)

Uso básico:
  python extract_swf_frames.py input.swf out_dir
  python extract_swf_frames.py input.swf out_dir --engine ffmpeg
  python extract_swf_frames.py input.swf out_dir --engine jpexs --ffdec /ruta/a/ffdec.jar --select 1-200 --zoom 2
  python extract_swf_frames.py input.swf out_dir --engine swfrender             # requiere swfdump y swfrender
  python extract_swf_frames.py input.swf out_dir --engine swfrender --frames 120

Notas:
- FFmpeg solo funcionará si tu SWF encapsula un flujo de VIDEO (FLV/VP6/H.263, etc.).
- JPEXS funciona bien para animaciones vectoriales/timeline (AS2/AS3). Requiere Java si usas ffdec.jar; con ffdec.bat no.
- SWFTools puede renderizar frames con swfrender; usamos swfdump para contar frames.
"""

import argparse
import os
import re
import shutil
import subprocess
import sys


def which(cmd: str) -> bool:
    """Return True if command is available in PATH."""
    return shutil.which(cmd) is not None


def run(cmd, check=True):
    print("+", " ".join(map(str, cmd)))
    return subprocess.run(cmd, check=check)


def ffmpeg_extract(inp: str, outdir: str) -> None:
    """
    Extrae todos los frames con FFmpeg. Solo para SWF con video embebido.
    """
    pattern = os.path.join(outdir, "frame_%05d.png")
    cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", inp, "-vsync", "0", pattern]
    run(cmd)


def jpexs_extract(inp: str, outdir: str, ffdec_path: str, select: str = None, zoom: float = None) -> None:
    """
    Usa JPEXS (ffdec.jar o ffdec.bat/.cmd/.exe) en modo CLI para exportar frames del timeline a PNG.
    -select acepta rangos tipo '1-100,150-'
    -zoom escala el render (1 = 100%)
    """
    if not ffdec_path:
        raise RuntimeError("Debes indicar --ffdec con la ruta a ffdec.jar o ffdec.bat")
    if not os.path.exists(ffdec_path):
        raise RuntimeError(f"No se encontró JPEXS en: {ffdec_path}")

    lower = ffdec_path.lower()
    if lower.endswith(".jar"):
        cmd = ["java", "-jar", ffdec_path, "-cli"]
    elif lower.endswith(".bat") or lower.endswith(".cmd") or lower.endswith(".exe"):
        cmd = [ffdec_path, "-cli"]
    else:
        # Si es un directorio, intenta descubrir ffdec.jar o ffdec.bat dentro
        if os.path.isdir(ffdec_path):
            cand_jar = os.path.join(ffdec_path, "ffdec.jar")
            cand_bat = os.path.join(ffdec_path, "ffdec.bat")
            if os.path.exists(cand_jar):
                cmd = ["java", "-jar", cand_jar, "-cli"]
            elif os.path.exists(cand_bat):
                cmd = [cand_bat, "-cli"]
            else:
                raise RuntimeError("No se encontró ffdec.jar ni ffdec.bat en el directorio indicado")
        else:
            raise RuntimeError("Extensión no reconocida para --ffdec; usa .jar/.bat/.cmd/.exe o una carpeta que contenga ffdec.jar")

    if zoom:
        cmd += ["-zoom", str(zoom)]
    cmd += ["-export", "frame"]
    if select:
        cmd += ["-select", select]
    os.makedirs(outdir, exist_ok=True)
    cmd += [outdir, inp]
    run(cmd)


def swfrender_extract(inp: str, outdir: str, frames: int = None) -> None:
    """
    Usa swfdump para obtener el número de frames y swfrender -p N para renderizar cada uno.
    """
    if not which("swfrender") or not which("swfdump"):
        raise RuntimeError("Se requieren 'swfrender' y 'swfdump' instalados y en PATH")

    if frames is None:
        # swfdump -f imprime algo como: "-f 123"
        print("Obteniendo número de frames con swfdump...")
        res = subprocess.run(["swfdump", "-f", inp], capture_output=True, text=True)
        if res.returncode != 0:
            raise RuntimeError(f"swfdump falló: {res.stderr.strip()}")
        m = re.search(r"-f\s+(\d+)", res.stdout)
        if not m:
            raise RuntimeError("No se pudo leer el conteo de frames desde swfdump")
        frames = int(m.group(1))
        print(f"Frames detectados: {frames}")

    os.makedirs(outdir, exist_ok=True)
    for n in range(1, frames + 1):
        out_png = os.path.join(outdir, f"frame_{n:05d}.png")
        cmd = ["swfrender", "-p", str(n), inp, "-o", out_png]
        run(cmd)


def main():
    ap = argparse.ArgumentParser(description="Extrae PNGs frame a frame desde un SWF")
    ap.add_argument("input", help="Ruta al archivo SWF de entrada")
    ap.add_argument("outdir", help="Carpeta de salida para los PNG")
    ap.add_argument("--engine", choices=["auto", "ffmpeg", "jpexs", "swfrender"], default="auto",
                    help="Motor a usar (auto intenta ffmpeg → jpexs → swfrender)")
    ap.add_argument("--ffdec", help="Ruta a ffdec.jar o ffdec.bat (JPEXS) para --engine jpexs o auto")
    ap.add_argument("--select", help="Rangos de frames para JPEXS, ej: 1-200,301- (opcional)")
    ap.add_argument("--zoom", type=float, help="Zoom/escala para JPEXS (1 = 100%)")
    ap.add_argument("--frames", type=int, help="Forzar número de frames para swfrender (si swfdump falla)")

    args = ap.parse_args()

    inp = args.input
    outdir = args.outdir
    os.makedirs(outdir, exist_ok=True)

    engine = args.engine

    if engine == "auto":
        if which("ffmpeg"):
            engine = "ffmpeg"
        elif args.ffdec:
            engine = "jpexs"
        elif which("swfrender") and which("swfdump"):
            engine = "swfrender"
        else:
            print("No se encontró ningún motor disponible.", file=sys.stderr)
            print("Instala al menos uno: FFmpeg, JPEXS (ffdec.jar/ffdec.bat) o SWFTools (swfrender + swfdump).", file=sys.stderr)
            sys.exit(2)

    try:
        if engine == "ffmpeg":
            ffmpeg_extract(inp, outdir)
        elif engine == "jpexs":
            jpexs_extract(inp, outdir, ffdec_path=args.ffdec, select=args.select, zoom=args.zoom)
        elif engine == "swfrender":
            swfrender_extract(inp, outdir, frames=args.frames)
        else:
            raise RuntimeError(f"Engine desconocido: {engine}")
    except subprocess.CalledProcessError as e:
        print(f"El comando falló con código {e.returncode}.", file=sys.stderr)
        if e.stderr:
            print(e.stderr, file=sys.stderr)
        sys.exit(e.returncode)
    except Exception as e:
        print("Error:", str(e), file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
