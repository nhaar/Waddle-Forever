#!/usr/bin/env python3
"""Utility to export Club Penguin room timelines for LOST-IN-TIME.

This script parses the TypeScript source of the TEST-Waddle-Forever server
in order to extract the room timelines (permanent updates, temporary
updates, openings and music rotations).  The resulting information is
emitted using the same schema that the LOST-IN-TIME web dashboard expects in
its Excel import template.  Optionally the script can also prepare the asset
storage layout (numbered folders for SWFs and preview images) and reuse the
SWF frame extraction helpers that already ship with the project.

Example usage (only print JSON data):

    python export_rooms.py --output rooms.json

Export a spreadsheet and populate the storage tree as well, copying SWFs
that exist locally and building PNG previews with JPEXS:

    python export_rooms.py \
        --output rooms.json \
        --excel records.xlsx \
        --storage-root storage \
        --copy-swf --extract-frames --extract-engine jpexs \
        --ffdec /path/to/ffdec.jar \
        --swf-root archives=/archives --swf-root recreation=/recreations \
        --swf-root svanilla=/svanilla --swf-root slegacy=/slegacy \
        --swf-root mammoth=/mammoth --swf-root fix=/fix \
        --swf-root approximation=/approximation --swf-root slippers07=/slippers

Include ``--allow-missing-assets`` if you only wish to generate the JSON/Excel
data without halting when a SWF prefix or file is absent locally.

Run ``python export_rooms.py --help`` for a full list of options.
"""

from __future__ import annotations

import argparse
from collections import defaultdict
import json
import re
import shutil
import subprocess
import sys
import textwrap
import uuid
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, Iterable, List, Mapping, Optional, Sequence, Set, Tuple

REPO_ROOT = Path(__file__).resolve().parents[1]
SERVER_SRC = REPO_ROOT / "src" / "server"
GAME_DATA_SRC = SERVER_SRC / "game-data"
ROOM_UPDATES_TS = GAME_DATA_SRC / "room-updates.ts"
UPDATES_TS = GAME_DATA_SRC / "updates.ts"
ROOMS_TS = GAME_DATA_SRC / "rooms.ts"
EXTRAER_SCRIPT = Path(__file__).resolve().parent / "ExtraerFrameSWF" / "extract_swf_frames.py"
DEFAULT_STORAGE_ROOT = Path(__file__).resolve().parent / "EXPORT-IMPORT" / "storage"

# ---------------------------------------------------------------------------
# Helpers to parse TypeScript constants by letting Node evaluate the literal
# ---------------------------------------------------------------------------


class TsConstantParser:
    """Parse TypeScript constants by delegating literal evaluation to Node.js."""

    def __init__(self, updates: Mapping[str, str]):
        self._updates = dict(updates)

    @staticmethod
    def _skip_whitespace(text: str, index: int) -> int:
        while index < len(text) and text[index].isspace():
            index += 1
        return index

    @staticmethod
    def _extract_literal(text: str, start: int) -> Tuple[str, int]:
        """Return the literal that starts at *start* along with its end index."""

        start = TsConstantParser._skip_whitespace(text, start)
        if start >= len(text):
            raise ValueError("Unexpected end of file while parsing constant")

        opening = text[start]
        if opening not in "[{":
            raise ValueError(f"Expected literal to start with {{ or [, got {opening!r}")
        closing = "}" if opening == "{" else "]"

        depth = 0
        i = start
        in_string: Optional[str] = None
        in_single_comment = False
        in_multi_comment = False
        escape = False

        while i < len(text):
            ch = text[i]

            if in_single_comment:
                if ch == "\n":
                    in_single_comment = False
                i += 1
                continue

            if in_multi_comment:
                if ch == "*" and i + 1 < len(text) and text[i + 1] == "/":
                    in_multi_comment = False
                    i += 2
                else:
                    i += 1
                continue

            if in_string:
                if escape:
                    escape = False
                elif ch == "\\":
                    escape = True
                elif ch == in_string:
                    in_string = None
                elif in_string == "`" and ch == "$" and i + 1 < len(text) and text[i + 1] == "{":
                    # Enter template expression; treat as nested literal
                    depth += 1
                    i += 2
                    continue
                i += 1
                continue

            if ch == "/" and i + 1 < len(text):
                nxt = text[i + 1]
                if nxt == "/":
                    in_single_comment = True
                    i += 2
                    continue
                if nxt == "*":
                    in_multi_comment = True
                    i += 2
                    continue

            if ch in "'\"`":
                in_string = ch
                i += 1
                continue

            if ch == opening:
                depth += 1
            elif ch == closing:
                depth -= 1
                if depth == 0:
                    i += 1
                    break
            i += 1

        if depth != 0:
            raise ValueError("Could not locate the end of the literal")

        literal = text[start:i]
        end = TsConstantParser._skip_whitespace(text, i)
        # Skip trailing semicolon if present
        if end < len(text) and text[end] == ";":
            end += 1
        return literal, end

    def parse_constant(self, file_path: Path, constant: str) -> Any:
        """Return the JSON-decoded value of a TypeScript constant."""

        text = file_path.read_text(encoding="utf-8")
        pattern = re.compile(rf"export const {re.escape(constant)}[^=]*=", re.MULTILINE)
        match = pattern.search(text)
        if not match:
            raise ValueError(f"Unable to find constant {constant} in {file_path}")

        literal, _ = self._extract_literal(text, match.end())

        script_lines = [
            "const Update = " + json.dumps(self._updates, ensure_ascii=False) + ";",
            f"const __result__ = {literal};",
            "console.log(JSON.stringify(__result__, null, 2));",
        ]
        script = "\n".join(script_lines)
        try:
            completed = subprocess.run(
                ["node", "-e", script],
                check=True,
                capture_output=True,
                text=True,
            )
        except FileNotFoundError as exc:
            raise RuntimeError(
                "Node.js is required to parse the TypeScript constants. "
                "Please ensure that the `node` executable is available in PATH."
            ) from exc
        except subprocess.CalledProcessError as exc:
            raise RuntimeError(
                "Node.js failed while evaluating the TypeScript literal.\n"
                f"Stdout:\n{exc.stdout}\nStderr:\n{exc.stderr}"
            ) from exc

        return json.loads(completed.stdout)


# ---------------------------------------------------------------------------
# Data classes
# ---------------------------------------------------------------------------


def _default_checklist(name: str) -> List[Dict[str, Any]]:
    template = [
        ("Animation test", "animation"),
        ("Interaction test", "interaction"),
    ]
    checklist = []
    for label, slug in template:
        key = uuid.uuid5(uuid.NAMESPACE_URL, f"lost-in-time/{slug}/{name}")
        checklist.append(
            {
                "key": f"checklist-{key}",
                "name": label,
                "checked": False,
                "legacy": False,
                "enabled": False,
            }
        )
    return checklist


@dataclass
class RoomEvent:
    room: str
    date: str
    file_ref: Optional[str]
    comment: Optional[str] = None
    end: Optional[str] = None
    other_rooms: Dict[str, str] = field(default_factory=dict)
    map_ref: Optional[str] = None
    frame: Optional[int] = None
    origin: str = ""
    event_type: str = "update"  # opening, update, temporary

    def base_name(self) -> str:
        if self.file_ref:
            _, _, tail = self.file_ref.partition(":")
            if tail:
                return Path(tail).stem
        normalized_date = self.date.replace("-", "")
        return f"{self.room}_{normalized_date}"

    def all_file_refs(self) -> List[str]:
        refs: List[str] = []
        if self.file_ref:
            refs.append(self.file_ref)
        if self.map_ref:
            refs.append(self.map_ref)
        refs.extend(ref for ref in self.other_rooms.values() if ref)
        return refs


@dataclass
class RoomRecord:
    id: int
    name: str
    status: str
    category: str
    fiesta: Optional[str]
    dates: List[Dict[str, Optional[str]]]
    room_label: str
    music: Optional[int]
    notes: Optional[str]
    image_path: Optional[str]
    checklist: List[Dict[str, Any]]
    credits: str
    swf_type: str
    swf_path: Optional[str]
    source_event: RoomEvent

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "status": self.status,
            "category": self.category,
            "fiesta": self.fiesta,
            "dates": self.dates,
            "room": self.room_label,
            "music": self.music,
            "notes": self.notes,
            "image_path": self.image_path,
            "checklist": self.checklist,
            "credits": self.credits,
            "swf_type": self.swf_type,
            "swf_path": self.swf_path,
        }


# ---------------------------------------------------------------------------
# Utility functions
# ---------------------------------------------------------------------------


def parse_updates() -> Dict[str, str]:
    """Return a mapping from update identifier to ISO date string."""

    mapping: Dict[str, str] = {}
    pattern = re.compile(r"^\s*(\w+)\s*=\s*'([^']+)'", re.MULTILINE)
    for name, value in pattern.findall(UPDATES_TS.read_text(encoding="utf-8")):
        mapping[name] = value
    return mapping


def date_sort_key(value: Optional[str]) -> Tuple[int, int, int, str]:
    """Return a sortable key for YYYY-MM-DD strings with optional placeholders."""

    if not value:
        return (9999, 12, 31, "")

    def _component(part: str, fallback: int) -> int:
        if not part or "#" in part:
            return fallback
        try:
            return int(part)
        except ValueError:
            return fallback

    parts = value.split("-")
    year = _component(parts[0], 0)
    month = _component(parts[1] if len(parts) > 1 else "01", 0)
    day = _component(parts[2] if len(parts) > 2 else "01", 0)
    return (year, month, day, value)


def normalize_comment(event: RoomEvent) -> Optional[str]:
    segments: List[str] = []
    if event.comment:
        segments.append(event.comment.strip())
    if event.map_ref:
        segments.append(f"Map reference: {event.map_ref}")
    if event.other_rooms:
        joined = ", ".join(f"{room}: {ref}" for room, ref in sorted(event.other_rooms.items()))
        segments.append(f"Other rooms: {joined}")
    if event.frame is not None:
        segments.append(f"Frame index: {event.frame}")
    if event.file_ref:
        segments.append(f"Source SWF: {event.file_ref}")
    if not segments:
        return None
    return " | ".join(segments)


def choose_category(event: RoomEvent) -> Tuple[str, Optional[str]]:
    text_candidates = [event.comment or "", event.file_ref or ""]
    text = " ".join(text_candidates).lower()
    if event.event_type == "temporary":
        return "temporary", None
    if "party" in text:
        return "party", event.comment
    return "base", None


def parse_music_timeline(raw: Mapping[str, Any]) -> Dict[str, List[Tuple[Optional[str], int, Optional[str]]]]:
    timelines: Dict[str, List[Tuple[Optional[str], int, Optional[str]]]] = {}
    for room, data in raw.items():
        if not isinstance(data, list) or not data:
            continue
        base_music = data[0]
        events: List[Tuple[Optional[str], int, Optional[str]]] = [(None, int(base_music), None)]
        for segment in data[1:]:
            if not isinstance(segment, dict):
                continue
            date = segment.get("date")
            music_id = segment.get("musicId")
            if music_id is None:
                continue
            comment = segment.get("comment")
            events.append((date, int(music_id), comment))
        events.sort(key=lambda item: date_sort_key(item[0]))
        timelines[room] = events
    return timelines


def lookup_music(timelines: Mapping[str, List[Tuple[Optional[str], int, Optional[str]]]], room: str, date: str) -> Optional[int]:
    data = timelines.get(room)
    if not data:
        return None
    best_id = data[0][1]
    current_key = date_sort_key(data[0][0])
    target_key = date_sort_key(date)
    for segment_date, music_id, _ in data[1:]:
        seg_key = date_sort_key(segment_date)
        if seg_key <= target_key and seg_key >= current_key:
            best_id = music_id
            current_key = seg_key
    return best_id


# ---------------------------------------------------------------------------
# Asset handling (copying SWFs and extracting frames)
# ---------------------------------------------------------------------------


class AssetManager:
    def __init__(
        self,
        storage_root: Path,
        swf_roots: Mapping[str, Path],
        copy_swf: bool,
        extract_frames: bool,
        engine: str,
        ffdec: Optional[str],
        select: Optional[str],
        zoom: Optional[float],
        frames_override: Optional[int],
        keep_all_frames: bool,
        overwrite: bool,
        allow_missing: bool,
    ) -> None:
        self.storage_root = storage_root
        self.swf_roots = {prefix: path for prefix, path in swf_roots.items()}
        self.copy_swf = copy_swf
        self.extract_frames = extract_frames
        self.engine = engine
        self.ffdec = ffdec
        self.select = select
        self.zoom = zoom
        self.frames_override = frames_override
        self.keep_all_frames = keep_all_frames
        self.overwrite = overwrite
        self.allow_missing = allow_missing
        self._extractor_module = None
        self._missing_prefixes: Set[str] = set()
        self._missing_files: Dict[str, List[Path]] = defaultdict(list)

    def _ensure_directory(self, path: Path) -> None:
        path.mkdir(parents=True, exist_ok=True)

    def _resolve_file(self, file_ref: Optional[str]) -> Optional[Path]:
        if not file_ref:
            return None
        if ":" not in file_ref:
            candidate = (REPO_ROOT / file_ref).resolve()
            if candidate.exists():
                return candidate
            if self.allow_missing:
                self._missing_files[file_ref].append(candidate)
                return None
            raise FileNotFoundError(
                f"No se pudo encontrar el archivo '{file_ref}' relativo a {REPO_ROOT}"
            )
        prefix, _, relative = file_ref.partition(":")
        base = self.swf_roots.get(prefix)
        if not base:
            self._missing_prefixes.add(prefix)
            if self.allow_missing:
                return None
            raise KeyError(
                f"No se proporcionó --swf-root para el prefijo '{prefix}', requerido por {file_ref}"
            )
        candidate = base / Path(relative)
        if candidate.exists():
            return candidate
        self._missing_files[file_ref].append(candidate)
        if self.allow_missing:
            return None
        raise FileNotFoundError(
            f"No se encontró el archivo '{file_ref}' en {candidate}"
        )

    def _load_extractor(self):
        if self._extractor_module is not None:
            return self._extractor_module
        if not EXTRAER_SCRIPT.exists():
            raise RuntimeError("extract_swf_frames.py was not found")
        import importlib.util

        spec = importlib.util.spec_from_file_location("extract_swf_frames", EXTRAER_SCRIPT)
        if spec is None or spec.loader is None:
            raise RuntimeError("Unable to load the SWF extraction helper")
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)  # type: ignore[assignment]
        self._extractor_module = module
        return module

    def _run_extractor(self, swf_path: Path, out_dir: Path) -> None:
        module = self._load_extractor()
        engine = self.engine
        if engine == "auto":
            if module.which("ffmpeg"):
                engine = "ffmpeg"
            elif self.ffdec:
                engine = "jpexs"
            elif module.which("swfrender") and module.which("swfdump"):
                engine = "swfrender"
            else:
                raise RuntimeError(
                    "No extraction engine available (FFmpeg, JPEXS or SWFTools)."
                )
        if engine == "ffmpeg":
            module.ffmpeg_extract(str(swf_path), str(out_dir))
        elif engine == "jpexs":
            module.jpexs_extract(
                str(swf_path),
                str(out_dir),
                ffdec_path=self.ffdec,
                select=self.select,
                zoom=self.zoom,
            )
        elif engine == "swfrender":
            module.swfrender_extract(
                str(swf_path),
                str(out_dir),
                frames=self.frames_override,
            )
        else:
            raise RuntimeError(f"Unknown extraction engine: {engine}")

    def process_record(self, record: RoomRecord) -> None:
        event = record.source_event
        src_path = self._resolve_file(event.file_ref)
        swf_dir = self.storage_root / "swf-files" / str(record.id)
        img_dir = self.storage_root / "record-images" / str(record.id)
        self._ensure_directory(swf_dir)
        self._ensure_directory(img_dir)

        if self.copy_swf and src_path:
            _, _, tail = event.file_ref.partition(":")
            dest_path = swf_dir / (Path(tail).name if tail else src_path.name)
            if dest_path.exists() and not self.overwrite:
                pass
            else:
                shutil.copy2(src_path, dest_path)

        if self.extract_frames and src_path:
            frames_dir = img_dir / "frames"
            if frames_dir.exists() and self.overwrite:
                shutil.rmtree(frames_dir)
            frames_dir.mkdir(parents=True, exist_ok=True)
            self._run_extractor(src_path, frames_dir)
            png_files = sorted(frames_dir.glob("*.png"))
            if png_files:
                cover_name = f"{record.name}.png"
                cover_path = img_dir / cover_name
                shutil.copy2(png_files[0], cover_path)
                if not self.keep_all_frames:
                    for extra in png_files[1:]:
                        extra.unlink(missing_ok=True)
                    if png_files[0].exists():
                        # keep the first frame inside frames/ as well
                        pass
                    try:
                        frames_dir.rmdir()
                    except OSError:
                        # directory not empty because ffmpeg may have written logs
                        pass

    def finalize(self) -> None:
        if not self.allow_missing and (self._missing_prefixes or self._missing_files):
            messages: List[str] = []
            if self._missing_prefixes:
                missing = ", ".join(sorted(self._missing_prefixes))
                messages.append(
                    "Faltan rutas para los siguientes prefijos de SWF: "
                    f"{missing}. Usa --swf-root PREFIJO=/ruta/al/directorio para cada uno."
                )
            if self._missing_files:
                details = "; ".join(
                    f"{ref} → {paths[0]}" for ref, paths in sorted(self._missing_files.items())
                )
                messages.append("No se encontraron los archivos especificados: " + details)
            raise RuntimeError("; ".join(messages))
        if self.allow_missing and self._missing_files:
            for ref, paths in sorted(self._missing_files.items()):
                candidate = paths[0]
                print(
                    f"[ADVERTENCIA] No se pudo copiar '{ref}'. Se buscó en: {candidate}",
                    file=sys.stderr,
                )
        if self.allow_missing and self._missing_prefixes:
            missing = ", ".join(sorted(self._missing_prefixes))
            print(
                "[ADVERTENCIA] No se proporcionaron rutas para los prefijos: "
                f"{missing}.",
                file=sys.stderr,
            )


# ---------------------------------------------------------------------------
# Exporter core
# ---------------------------------------------------------------------------


class RoomTimelineExporter:
    def __init__(self, parser: TsConstantParser):
        self.parser = parser
        self.rooms_meta: Dict[str, Any] = {}
        self.room_updates: Dict[str, Any] = {}
        self.room_openings: List[Dict[str, Any]] = []
        self.temporary_updates: Dict[str, Any] = {}
        self.music_timeline: Dict[str, List[Tuple[Optional[str], int, Optional[str]]]] = {}

    def load(self) -> None:
        self.rooms_meta = self.parser.parse_constant(ROOMS_TS, "ROOMS")
        self.room_updates = self.parser.parse_constant(ROOM_UPDATES_TS, "ROOM_UPDATES")
        self.room_openings = self.parser.parse_constant(ROOM_UPDATES_TS, "ROOM_OPENINGS")
        temp_raw = self.parser.parse_constant(ROOM_UPDATES_TS, "TEMPORARY_ROOM_UPDATES")
        self.temporary_updates = temp_raw or {}
        music_raw = self.parser.parse_constant(ROOM_UPDATES_TS, "ROOM_MUSIC_TIMELINE")
        self.music_timeline = parse_music_timeline(music_raw or {})

    def _build_room_label(self, room: str) -> str:
        entry = self.rooms_meta.get(room)
        if isinstance(entry, dict):
            label = entry.get("name") or entry.get("preCpipName")
            if label:
                return label
        return room

    def _gather_events(self) -> List[RoomEvent]:
        events: List[RoomEvent] = []
        for opening in self.room_openings:
            room = opening.get("room")
            if not room:
                continue
            event = RoomEvent(
                room=room,
                date=opening.get("date"),
                file_ref=opening.get("fileRef"),
                comment=None,
                other_rooms=opening.get("otherRooms") or {},
                map_ref=opening.get("map"),
                origin="opening",
                event_type="opening",
            )
            events.append(event)
        for room, updates in self.room_updates.items():
            if not isinstance(updates, list):
                continue
            for update in updates:
                if not isinstance(update, dict):
                    continue
                events.append(
                    RoomEvent(
                        room=room,
                        date=update.get("date"),
                        file_ref=update.get("fileRef"),
                        comment=update.get("comment"),
                        origin="permanent",
                        event_type="update",
                    )
                )
        for room, updates in self.temporary_updates.items():
            if not isinstance(updates, list):
                continue
            for update in updates:
                events.append(
                    RoomEvent(
                        room=room,
                        date=update.get("date"),
                        end=update.get("end"),
                        file_ref=update.get("fileRef"),
                        comment=update.get("comment"),
                        frame=update.get("frame"),
                        origin="temporary",
                        event_type="temporary",
                    )
                )
        return events

    def generate_records(self, *, status: str, swf_type: str, start_id: int = 1) -> List[RoomRecord]:
        events = self._gather_events()
        events.sort(key=lambda ev: (date_sort_key(ev.date), ev.room, ev.base_name()))
        records: List[RoomRecord] = []
        current_id = start_id

        for event in events:
            base_name = event.base_name()
            category, fiesta = choose_category(event)
            notes = normalize_comment(event)
            dates = [{"start": event.date, "end": event.end}]
            room_label = self._build_room_label(event.room)
            music_id = lookup_music(self.music_timeline, event.room, event.date)
            image_path = f"record-images/{current_id}/{base_name}.png"
            swf_path: Optional[str]
            if event.file_ref:
                _, _, tail = event.file_ref.partition(":")
                filename = Path(tail).name if tail else base_name + ".swf"
                swf_path = f"swf-files/{current_id}/{filename}"
            else:
                swf_path = None
            record = RoomRecord(
                id=current_id,
                name=base_name,
                status=status,
                category=category,
                fiesta=fiesta,
                dates=dates,
                room_label=room_label,
                music=music_id,
                notes=notes,
                image_path=image_path if event.file_ref else None,
                checklist=_default_checklist(base_name),
                credits="-",
                swf_type=swf_type,
                swf_path=swf_path,
                source_event=event,
            )
            records.append(record)
            current_id += 1
        return records


# ---------------------------------------------------------------------------
# Excel export helpers
# ---------------------------------------------------------------------------


def write_excel(records: Sequence[RoomRecord], excel_path: Path) -> None:
    try:
        from openpyxl import Workbook  # type: ignore
    except ImportError as exc:  # pragma: no cover - dependency error path
        raise RuntimeError(
            "La librería 'openpyxl' es necesaria para generar el archivo de Excel. "
            "Instálala con `pip install openpyxl` e inténtalo de nuevo."
        ) from exc

    excel_path.parent.mkdir(parents=True, exist_ok=True)

    workbook = Workbook()
    worksheet = workbook.active
    worksheet.title = "Registros"

    headers = [
        "ID List",
        "Nombre",
        "Estado",
        "Categoría",
        "Fiesta",
        "Fechas (JSON)",
        "Sala",
        "Música",
        "Notas",
        "Ruta de imagen en Storage",
        "Checklist (JSON)",
        "Créditos",
        "Tipo de SWF",
        "Ruta de SWF en Storage",
    ]
    worksheet.append(headers)

    for record in records:
        dates_json = json.dumps(record.dates, ensure_ascii=False, separators=(",", ":"))
        checklist_json = json.dumps(record.checklist, ensure_ascii=False, separators=(",", ":"))
        row = [
            str(record.id),
            record.name,
            record.status,
            record.category,
            record.fiesta,
            dates_json,
            record.room_label,
            record.music,
            record.notes,
            record.image_path,
            checklist_json,
            record.credits,
            record.swf_type,
            record.swf_path,
        ]
        worksheet.append(row)

    worksheet.freeze_panes = "A2"
    workbook.save(excel_path)


# ---------------------------------------------------------------------------
# Command-line interface
# ---------------------------------------------------------------------------


def build_argument_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Export room timeline data for the LOST-IN-TIME web dashboard.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=textwrap.dedent(
            """
            The script reads the TypeScript timeline definitions directly from the
            TEST-Waddle-Forever repository, generates a JSON payload compatible with
            the Excel importer used by the LOST-IN-TIME administration site and, if
            requested, organises SWF assets and PNG previews in numbered folders.
            """
        ),
    )
    parser.add_argument(
        "--output",
        type=Path,
        help="Write the JSON export to this file instead of stdout.",
    )
    parser.add_argument(
        "--excel",
        type=Path,
        help="Write an Excel workbook compatible with the LOST-IN-TIME importer.",
    )
    parser.add_argument(
        "--status",
        default="En proceso",
        help="Default status label assigned to every record (default: 'En proceso').",
    )
    parser.add_argument(
        "--swf-type",
        default="recreation",
        help="Value stored in the 'Tipo de SWF' column (default: 'recreation').",
    )
    parser.add_argument(
        "--storage-root",
        type=Path,
        default=DEFAULT_STORAGE_ROOT,
        help="Root directory where the numbered asset folders will be created.",
    )
    parser.add_argument(
        "--swf-root",
        action="append",
        default=[],
        metavar="PREFIX=PATH",
        help="Map a SWF namespace prefix (e.g. 'archives') to a local directory.",
    )
    parser.add_argument(
        "--copy-swf",
        action="store_true",
        help="Copy SWF files into the storage tree when they are available locally.",
    )
    parser.add_argument(
        "--extract-frames",
        action="store_true",
        help="Extract PNG frames for each SWF using the ExtraerFrameSWF helpers.",
    )
    parser.add_argument(
        "--extract-engine",
        choices=["auto", "ffmpeg", "jpexs", "swfrender"],
        default="auto",
        help="Extraction engine to use when --extract-frames is enabled.",
    )
    parser.add_argument("--ffdec", help="Path to ffdec.jar or ffdec.bat for JPEXS extractions.")
    parser.add_argument("--select", help="Frame selection expression for JPEXS extractions.")
    parser.add_argument(
        "--zoom",
        type=float,
        help="Zoom factor for JPEXS extractions (1.0 means 100%%).",
    )
    parser.add_argument(
        "--frames",
        type=int,
        help="Override the frame count when using the swfrender engine.",
    )
    parser.add_argument(
        "--keep-all-frames",
        action="store_true",
        help="Keep every extracted frame instead of only storing the first PNG.",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Overwrite existing files inside the storage tree.",
    )
    parser.add_argument(
        "--allow-missing-assets",
        action="store_true",
        help=(
            "No detener la exportación si faltan SWF o prefijos sin asignar. "
            "En su lugar se mostrarán advertencias."
        ),
    )
    return parser


def parse_swf_roots(values: Sequence[str]) -> Dict[str, Path]:
    mapping: Dict[str, Path] = {}
    for value in values:
        if "=" not in value:
            raise argparse.ArgumentTypeError(
                f"Expected PREFIX=PATH format for --swf-root, got {value!r}"
            )
        prefix, path_str = value.split("=", 1)
        path = Path(path_str).expanduser().resolve()
        mapping[prefix.strip()] = path
    return mapping


def collect_required_prefixes(records: Iterable[RoomRecord]) -> Set[str]:
    prefixes: Set[str] = set()
    for record in records:
        for ref in record.source_event.all_file_refs():
            if ":" not in ref:
                continue
            prefix, _, _ = ref.partition(":")
            if prefix:
                prefixes.add(prefix)
    return prefixes


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------


def main(argv: Optional[Sequence[str]] = None) -> int:
    parser = build_argument_parser()
    args = parser.parse_args(argv)

    updates_map = parse_updates()
    ts_parser = TsConstantParser(updates_map)
    exporter = RoomTimelineExporter(ts_parser)
    exporter.load()

    records = exporter.generate_records(status=args.status, swf_type=args.swf_type)

    swf_roots = parse_swf_roots(args.swf_root)
    if args.copy_swf or args.extract_frames:
        required_prefixes = collect_required_prefixes(records)
        missing_prefixes = required_prefixes - set(swf_roots)
        if missing_prefixes and not args.allow_missing_assets:
            missing = ", ".join(sorted(missing_prefixes))
            raise SystemExit(
                "Debes especificar --swf-root para los prefijos: "
                f"{missing}. Usa --allow-missing-assets si quieres continuar sin ellos."
            )

    if args.copy_swf or args.extract_frames:
        asset_manager = AssetManager(
            storage_root=args.storage_root,
            swf_roots=swf_roots,
            copy_swf=args.copy_swf,
            extract_frames=args.extract_frames,
            engine=args.extract_engine,
            ffdec=args.ffdec,
            select=args.select,
            zoom=args.zoom,
            frames_override=args.frames,
            keep_all_frames=args.keep_all_frames,
            overwrite=args.overwrite,
            allow_missing=args.allow_missing_assets,
        )
        for record in records:
            asset_manager.process_record(record)
        asset_manager.finalize()

    output_payload = [record.to_dict() for record in records]
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(json.dumps(output_payload, ensure_ascii=False, indent=2), encoding="utf-8")
    else:
        json.dump(output_payload, sys.stdout, ensure_ascii=False, indent=2)
        sys.stdout.write("\n")

    if args.excel:
        write_excel(records, args.excel)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
