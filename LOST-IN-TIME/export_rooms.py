#!/usr/bin/env python3
"""Utility to export room timelines into the LOST-IN-TIME/EXPORT-IMPORT format.

This script inspects the TypeScript sources from the main Waddle Forever project
and produces an Excel workbook plus the expected storage tree (PNG previews and
SWF copies) ready to be uploaded to the LOST-IN-TIME web administration tool.

Features
========
* Reads the canonical game data (rooms, openings, updates, parties, temporary
  changes and music timelines) directly from the TypeScript source files using
  ``ts-node`` so the export stays in sync with the game.
* Builds a chronological list of room states (permanent, temporary, parties and
  constructions) and formats it like ``EXPORT-IMPORT/records.xlsx``.
* Copies every referenced SWF into ``storage/swf-files/<ID>/`` and creates a PNG
  preview in ``storage/record-images/<ID>/`` leveraging the frame extraction
  helpers from ``ExtraerFrameSWF/extract_swf_frames.py``.

Requirements
============
* Node.js with the project dependencies installed (``yarn install``).
* ``ts-node`` (already a dev dependency of the project).
* Optional: FFmpeg, JPEXS or SWFTools if you want automatic PNG previews. The
  script shares the same options as ``extract_swf_frames.py`` and gracefully
  skips previews when no engine is available.

Usage
=====
::

    python export_rooms.py \
        --repo-root .. \
        --output LOST-IN-TIME/EXPORT-IMPORT \
        --engine auto \
        --ffdec /path/to/ffdec.jar

Run ``python export_rooms.py --help`` for all options.
"""
from __future__ import annotations

import argparse
import json
import logging
import os
import re
import shutil
import subprocess
import sys
from collections import defaultdict
from dataclasses import dataclass
from datetime import date, timedelta
from pathlib import Path
from tempfile import TemporaryDirectory
from typing import Any, Dict, Iterable, List, Optional, Tuple

try:
    from openpyxl import Workbook
except ImportError as exc:  # pragma: no cover - dependency error is surfaced to the user
    raise SystemExit(
        "openpyxl is required. Install it with 'pip install openpyxl' before running this script.'"
    ) from exc

# ---------------------------------------------------------------------------
# Optional import of the frame extraction helpers
# ---------------------------------------------------------------------------
EXTRAER_DIR = Path(__file__).resolve().parent / "ExtraerFrameSWF"
if EXTRAER_DIR.exists():
    sys.path.append(str(EXTRAER_DIR))
try:
    import extract_swf_frames  # type: ignore
except Exception:  # pragma: no cover - fallback when helper isn't available
    extract_swf_frames = None


def discover_ffdec_path() -> Optional[Path]:
    """Try to locate a default ffdec.jar/bat installation."""

    def expand(candidate: Optional[str]) -> Optional[Path]:
        if not candidate:
            return None
        path = Path(candidate).expanduser()
        return path if path.exists() else None

    # First honour explicit environment overrides.
    for env_var in ("FFDEC", "FFDEC_PATH", "JPEXS_FFDEC"):
        env_value = expand(os.environ.get(env_var))
        if env_value:
            return env_value

    # Look for common installation folders on Windows (default from the shared instructions).
    common_locations = [
        Path("C:/Program Files/FFDec/ffdec.jar"),
        Path("C:/Program Files/FFDec/ffdec.exe"),
        Path("C:/Program Files/FFDec/ffdec.bat"),
        Path("C:/Program Files (x86)/FFDec/ffdec.jar"),
        Path("C:/Program Files (x86)/FFDec/ffdec.exe"),
        Path("C:/Program Files (x86)/FFDec/ffdec.bat"),
    ]
    for location in common_locations:
        if location.exists():
            return location

    # Probe additional folders that are commonly used by the JPEXS installer.
    def probe_windows_roots() -> Iterable[Path]:
        for env_name in ("ProgramFiles", "ProgramFiles(x86)", "ProgramW6432", "LOCALAPPDATA"):
            value = expand(os.environ.get(env_name))
            if value:
                yield value

    def search_within(root: Path) -> Optional[Path]:
        names = [
            root / "JPEXS Free Flash Decompiler",
            root / "JPEXS Free Flash Decompiler (Nightly)",
            root / "FFDec",
            root / "FFDec nightly",
        ]
        for name in names:
            if name.exists():
                for candidate in iter_ffdec_candidates(name):
                    return candidate
        # Fall back to a shallow glob so we do not crawl the entire Program Files tree.
        for pattern in ("*/ffdec.jar", "*/ffdec.exe", "*/ffdec.bat", "*/*/ffdec.jar", "*/*/ffdec.exe", "*/*/ffdec.bat"):
            for candidate in root.glob(pattern):
                return candidate
        return None

    for windows_root in probe_windows_roots():
        candidate = search_within(windows_root)
        if candidate:
            return candidate

    # Try to extract a hint from the helper folder (Codigo usado.txt stores the manual command).
    codigo_txt = EXTRAER_DIR / "Codigo usado.txt"
    if codigo_txt.exists():
        content = codigo_txt.read_text(encoding="utf-8", errors="ignore")
        match = re.search(r"\$ffdec\s*=\s*\"([^\"]+)\"", content)
        if match:
            hint = expand(match.group(1))
            if hint:
                return hint

    # Finally, see if the helper directory bundles ffdec.
    bundled = [
        EXTRAER_DIR / "ffdec.jar",
        EXTRAER_DIR / "ffdec.bat",
        EXTRAER_DIR / "ffdec.exe",
        EXTRAER_DIR / "ffdec/ffdec.jar",
        EXTRAER_DIR / "ffdec/ffdec.bat",
        EXTRAER_DIR / "ffdec/ffdec.exe",
    ]
    for bundle in bundled:
        if bundle.exists():
            return bundle

    return None


def iter_ffdec_candidates(base: Path) -> Iterable[Path]:
    """Yield plausible ffdec executables relative to *base*.

    ``extract_swf_frames.py`` accepts either ``ffdec.jar`` or ``ffdec.bat/.exe``.
    Users sometimes point to the installation directory instead of the specific
    file, so we probe common names (both in the root and immediate subfolders)
    before giving up.
    """

    names = ("ffdec.jar", "ffdec.exe", "ffdec.bat", "ffdec.cmd")
    for name in names:
        candidate = base / name
        if candidate.exists():
            yield candidate
    for subdir in ("bin", "lib"):
        for name in names:
            candidate = base / subdir / name
            if candidate.exists():
                yield candidate


def normalize_ffdec_path(ffdec: Optional[Path]) -> Optional[Path]:
    """Resolve *ffdec* to an executable path understood by JPEXS."""

    if ffdec is None:
        return None

    ffdec = ffdec.expanduser()
    if ffdec.is_file():
        return ffdec
    if ffdec.is_dir():
        for candidate in iter_ffdec_candidates(ffdec):
            return candidate
        # Some portable bundles place ffdec.jar deeper in the folder tree.
        for candidate in ffdec.rglob("ffdec.jar"):
            return candidate
        for candidate in ffdec.rglob("ffdec.bat"):
            return candidate
        for candidate in ffdec.rglob("ffdec.exe"):
            return candidate
        return None

    # Path with a known suffix that does not exist yet – try to look in the
    # parent folder for a similarly named file (case-insensitive installs on
    # Windows sometimes rename the executable).
    suffix = ffdec.suffix.lower()
    if suffix in {".jar", ".bat", ".cmd", ".exe"}:
        parent = ffdec.parent
        if parent.exists():
            target_name = ffdec.name.lower()
            for child in parent.iterdir():
                if child.name.lower() == target_name:
                    return child
            for candidate in iter_ffdec_candidates(parent):
                return candidate

    return ffdec if ffdec.exists() else None

# ---------------------------------------------------------------------------
# Constants and configuration helpers
# ---------------------------------------------------------------------------
BETA_RELEASE = "2005-08-22"
DEFAULT_STATUS = "En proceso"
DEFAULT_CREDITS = "-"
DEFAULT_CHECKLIST = [
    {
        "key": "animation-test",
        "name": "Animation test",
        "checked": False,
        "legacy": False,
        "enabled": False,
    },
    {
        "key": "interaction-test",
        "name": "Interaction test",
        "checked": False,
        "legacy": False,
        "enabled": False,
    },
]

HEADERS = [
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

# ---------------------------------------------------------------------------
# Dataclasses that represent the intermediate and final records
# ---------------------------------------------------------------------------
@dataclass
class RoomEvent:
    """A single room state change."""

    room: str
    start: str
    end: Optional[str]
    file_ref: Optional[str]
    category: str
    party: Optional[str] = None
    comment: Optional[str] = None
    music: Optional[int] = None
    frame: Optional[int] = None
    source: str = ""


@dataclass
class ExportRecord:
    """Final representation written into the spreadsheet."""

    id: int
    nombre: str
    status: str
    category: str
    fiesta: Optional[str]
    fechas_json: str
    room_label: str
    music: Optional[str]
    notes: str
    image_rel_path: str
    checklist_json: str
    credits: str
    swf_type: str
    swf_rel_path: str
    file_ref: Optional[str]
    frame: Optional[int]
    start: str


# ---------------------------------------------------------------------------
# Utility helpers
# ---------------------------------------------------------------------------
def parse_args() -> argparse.Namespace:
    script_dir = Path(__file__).resolve().parent
    default_repo_root = script_dir.parent
    default_output = default_repo_root / "LOST-IN-TIME" / "EXPORT-IMPORT"

    parser = argparse.ArgumentParser(description="Export Club Penguin room data to the LOST-IN-TIME import format")
    parser.add_argument("--repo-root", type=Path, default=default_repo_root, help="Path to the repository root")
    parser.add_argument(
        "--output",
        type=Path,
        default=default_output,
        help="Destination folder (will mirror the EXPORT-IMPORT layout)",
    )
    parser.add_argument(
        "--engine",
        choices=["auto", "ffmpeg", "jpexs", "swfrender", "none"],
        default="auto",
        help="Frame extraction engine. Use 'none' to skip PNG previews.",
    )
    parser.add_argument(
        "--ffdec",
        type=Path,
        help="Path to ffdec.jar or ffdec.bat when using the JPEXS engine (auto-detected when possible)",
    )
    parser.add_argument(
        "--preview-zoom",
        type=float,
        default=2.0,
        help="Zoom level for JPEXS previews (matches the manual extract_swf_frames.py command)",
    )
    parser.add_argument(
        "--clean",
        action="store_true",
        help="Remove existing records.xlsx and storage directory before generating new data",
    )
    parser.add_argument(
        "--skip-media",
        action="store_true",
        help="Do not copy SWF files or extract PNG previews (useful for quick dry-runs)",
    )
    parser.add_argument(
        "--log-level",
        default="INFO",
        choices=["DEBUG", "INFO", "WARNING", "ERROR"],
        help="Logging verbosity",
    )
    return parser.parse_args()


def configure_logging(level: str) -> None:
    logging.basicConfig(
        format="[%(levelname)s] %(message)s",
        level=getattr(logging, level.upper(), logging.INFO),
    )


def slugify(value: str) -> str:
    value = value.replace("/", "-")
    value = re.sub(r"[^A-Za-z0-9_-]+", "-", value)
    value = re.sub(r"-+", "-", value)
    return value.strip("-") or "room"


def ensure_directory(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def json_dump(data: Any) -> str:
    return json.dumps(data, ensure_ascii=False)


def parse_version(version: str) -> Tuple[date, bool]:
    """Parse WF version strings (YYYY-MM-DD or with '##')."""

    parts = version.split("-")
    if len(parts) != 3:
        raise ValueError(f"Invalid version: {version}")
    year = int(parts[0])
    month_unknown = parts[1] == "##"
    day_unknown = parts[2] == "##"
    month = 1 if month_unknown else int(parts[1])
    day = 1 if day_unknown else int(parts[2])
    return date(year, month, day), (month_unknown or day_unknown)


def version_sort_key(version: str) -> Tuple[int, int, int, str]:
    d, _ = parse_version(version)
    return (d.year, d.month, d.day, version)


def compute_period_end(start: str, next_start: Optional[str]) -> Optional[str]:
    if next_start is None:
        return None
    start_date, start_unknown = parse_version(start)
    next_date, next_unknown = parse_version(next_start)
    if start_unknown or next_unknown:
        return next_start
    end_date = next_date - timedelta(days=1)
    if end_date < start_date:
        return next_start
    return end_date.isoformat()


def get_music_lookup(raw_music: Dict[str, List[Any]]) -> Dict[str, List[Tuple[str, int]]]:
    lookup: Dict[str, List[Tuple[str, int]]] = {}
    for room, entries in raw_music.items():
        if not entries:
            continue
        default_id = entries[0]
        timeline: List[Tuple[str, int]] = [("0001-01-01", default_id)]
        for entry in entries[1:]:
            timeline.append((entry["date"], entry["musicId"]))
        timeline.sort(key=lambda pair: version_sort_key(pair[0]))
        lookup[room] = timeline
    return lookup


def get_music_for_date(lookup: Dict[str, List[Tuple[str, int]]], room: str, version: str) -> Optional[int]:
    timeline = lookup.get(room)
    if not timeline:
        return None
    selected = timeline[0][1]
    version_key = version_sort_key(version)
    for entry_date, music_id in timeline:
        if version_sort_key(entry_date) <= version_key:
            selected = music_id
        else:
            break
    return selected


def call_node_for_data(repo_root: Path) -> Dict[str, Any]:
    if shutil.which("node") is None:
        raise SystemExit("Node.js is required to run this exporter.")
    js_code = r"""
const { ROOMS } = require('./src/server/game-data/rooms');
const { ORIGINAL_ROOMS } = require('./src/server/game-data/release-features');
const { ROOM_OPENINGS, ROOM_UPDATES, TEMPORARY_ROOM_UPDATES, ROOM_MUSIC_TIMELINE } = require('./src/server/game-data/room-updates');
const { PARTIES } = require('./src/server/game-data/parties');
const data = {
  rooms: ROOMS,
  originalRooms: ORIGINAL_ROOMS,
  roomOpenings: ROOM_OPENINGS,
  roomUpdates: ROOM_UPDATES,
  temporaryRoomUpdates: TEMPORARY_ROOM_UPDATES,
  roomMusicTimeline: ROOM_MUSIC_TIMELINE,
  parties: PARTIES,
};
const replacer = (_key, value) => {
  if (value instanceof Map) {
    return Object.fromEntries(value.entries());
  }
  if (value instanceof Set) {
    return Array.from(value.values());
  }
  return value;
};
process.stdout.write(JSON.stringify(data, replacer));
"""
    cmd = [
        "node",
        "-r",
        "ts-node/register/transpile-only",
        "-e",
        js_code,
    ]
    try:
        result = subprocess.run(
            cmd,
            cwd=repo_root,
            check=True,
            capture_output=True,
            text=True,
        )
    except subprocess.CalledProcessError as exc:  # pragma: no cover - surfaces node errors
        logging.error("Node execution failed: %s", exc.stderr.strip())
        raise SystemExit(1) from exc
    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError as exc:  # pragma: no cover - invalid JSON
        logging.error("Failed to parse game data JSON: %s", exc)
        raise SystemExit(1) from exc


# ---------------------------------------------------------------------------
# Timeline assembly helpers
# ---------------------------------------------------------------------------
def add_base_event(
    base_events: Dict[str, List[RoomEvent]],
    room: str,
    start: str,
    file_ref: Optional[str],
    comment: Optional[str],
    source: str,
    music_lookup: Dict[str, List[Tuple[str, int]]],
) -> None:
    if file_ref is None:
        return
    event = RoomEvent(
        room=room,
        start=start,
        end=None,
        file_ref=file_ref,
        category="base",
        comment=comment,
        source=source,
        music=get_music_for_date(music_lookup, room, start),
    )
    base_events[room].append(event)


def add_temporary_event(
    temporary_events: List[RoomEvent],
    room: str,
    start: str,
    end: Optional[str],
    file_ref: Optional[str],
    category: str,
    comment: Optional[str],
    party: Optional[str],
    music: Optional[int],
    frame: Optional[int],
    source: str,
) -> None:
    if file_ref is None:
        return
    if end is not None and start == end:
        logging.debug("Skipping zero-length temporary event for %s at %s", room, start)
        return
    temporary_events.append(
        RoomEvent(
            room=room,
            start=start,
            end=end,
            file_ref=file_ref,
            category=category,
            party=party,
            comment=comment,
            music=music,
            frame=frame,
            source=source,
        )
    )


def get_sub_update_dates(update: Dict[str, Any], index: int) -> Tuple[str, Optional[str]]:
    updates = update.get("updates")
    if not updates:
        raise ValueError("Update must include sub updates")
    sub_update = updates[index]
    end = sub_update.get("end")
    if end is None:
        next_update = updates[index + 1] if index + 1 < len(updates) else None
        if next_update and next_update.get("date"):
            end = next_update["date"]
    if end is None:
        end = update.get("end")
    start = sub_update.get("date", update.get("date"))
    if start == end:
        logging.debug("Ignoring zero-length sub update at %s", start)
        return start, None
    return start, end


def process_parties(
    parties: List[Dict[str, Any]],
    base_events: Dict[str, List[RoomEvent]],
    temporary_events: List[RoomEvent],
    music_lookup: Dict[str, List[Tuple[str, int]]],
) -> None:
    for party in parties:
        party_name = party.get("name", "") or None
        party_start = party["date"]
        party_end = party.get("end")
        party_category = "event" if party.get("event") else "party"
        room_frames = party.get("roomFrames", {})
        room_music = party.get("music", {})
        party_comment = party.get("roomComment")

        permanent = party.get("permanentChanges") or {}
        for room, file_ref in (permanent.get("roomChanges") or {}).items():
            add_base_event(
                base_events,
                room,
                party_start,
                file_ref,
                permanent.get("roomComment") or party_comment,
                f"party-permanent:{party_name or ''}",
                music_lookup,
            )

        for room, file_ref in (party.get("roomChanges") or {}).items():
            add_temporary_event(
                temporary_events,
                room,
                party_start,
                party_end,
                file_ref,
                party_category,
                party_comment,
                party_name,
                room_music.get(room),
                room_frames.get(room),
                "party",
            )

        updates = party.get("updates") or []
        for idx, update in enumerate(updates):
            sub_start, sub_end = get_sub_update_dates(party, idx)
            update_frames = update.get("roomFrames", {})
            update_music = update.get("music", {})
            for room, file_ref in (update.get("roomChanges") or {}).items():
                add_temporary_event(
                    temporary_events,
                    room,
                    sub_start,
                    sub_end,
                    file_ref,
                    party_category,
                    update.get("comment") or party_comment,
                    party_name,
                    update_music.get(room),
                    update_frames.get(room),
                    "party-update",
                )

        construction = party.get("construction")
        if construction:
            const_start = construction["date"]
            const_end = party_start
            const_frames = construction.get("roomFrames", {})
            const_music = construction.get("music", {})
            for room, file_ref in (construction.get("changes") or {}).items():
                add_temporary_event(
                    temporary_events,
                    room,
                    const_start,
                    const_end,
                    file_ref,
                    "construction",
                    construction.get("comment"),
                    party_name,
                    const_music.get(room),
                    const_frames.get(room),
                    "construction",
                )
            const_updates = construction.get("updates") or []
            fake_parent = {
                "date": const_start,
                "end": const_end,
                "updates": const_updates,
            }
            for idx, update in enumerate(const_updates):
                sub_start, sub_end = get_sub_update_dates(fake_parent, idx)
                for room, file_ref in (update.get("changes") or {}).items():
                    add_temporary_event(
                        temporary_events,
                        room,
                        sub_start,
                        sub_end,
                        file_ref,
                        "construction",
                        update.get("comment"),
                        party_name,
                        None,
                        None,
                        "construction-update",
                    )

        consequences = party.get("consequences") or {}
        for room, file_ref in (consequences.get("roomChanges") or {}).items():
            add_base_event(
                base_events,
                room,
                party_end or party_start,
                file_ref,
                consequences.get("roomComment") or party_comment,
                f"party-consequence:{party_name or ''}",
                music_lookup,
            )


def build_events(game_data: Dict[str, Any]) -> Tuple[List[RoomEvent], Dict[str, List[RoomEvent]]]:
    music_lookup = get_music_lookup(game_data["roomMusicTimeline"])

    base_events: Dict[str, List[RoomEvent]] = defaultdict(list)
    temporary_events: List[RoomEvent] = []

    for room, file_ref in game_data["originalRooms"].items():
        add_base_event(base_events, room, BETA_RELEASE, file_ref, None, "original", music_lookup)

    for opening in game_data["roomOpenings"]:
        comment = opening.get("comment")
        if opening.get("fileRef"):
            add_base_event(
                base_events,
                opening["room"],
                opening["date"],
                opening["fileRef"],
                comment,
                "opening",
                music_lookup,
            )
        for room, file_ref in (opening.get("otherRooms") or {}).items():
            add_base_event(base_events, room, opening["date"], file_ref, comment, "opening-other", music_lookup)

    for room, updates in game_data["roomUpdates"].items():
        for update in updates:
            add_base_event(
                base_events,
                room,
                update["date"],
                update["fileRef"],
                update.get("comment"),
                "update",
                music_lookup,
            )

    for room, updates in (game_data["temporaryRoomUpdates"] or {}).items():
        for update in updates:
            add_temporary_event(
                temporary_events,
                room,
                update["date"],
                update.get("end"),
                update["fileRef"],
                "temporary",
                update.get("comment"),
                None,
                None,
                update.get("frame"),
                "temporary",
            )

    process_parties(game_data["parties"], base_events, temporary_events, music_lookup)

    for room, events in base_events.items():
        events.sort(key=lambda ev: version_sort_key(ev.start))
        for idx, event in enumerate(events):
            next_start = events[idx + 1].start if idx + 1 < len(events) else None
            event.end = compute_period_end(event.start, next_start)

    return temporary_events, base_events


def build_records(
    rooms: Dict[str, Any],
    temporary_events: List[RoomEvent],
    base_events: Dict[str, List[RoomEvent]],
) -> List[ExportRecord]:
    all_events: List[RoomEvent] = []
    for events in base_events.values():
        all_events.extend(events)
    all_events.extend(temporary_events)

    all_events.sort(key=lambda ev: (version_sort_key(ev.start), ev.room, ev.category))

    records: List[ExportRecord] = []
    for idx, event in enumerate(all_events, start=1):
        room_info = rooms.get(event.room) or {}
        room_label = room_info.get("name", event.room.title())
        file_ref = event.file_ref
        if file_ref:
            prefix, path_part = file_ref.split(":", 1)
            file_name = Path(path_part).name
            nombre = slugify(Path(path_part).stem)
            swf_type = prefix
        else:
            nombre = slugify(f"{event.room}-{event.start}")
            file_name = ""
            swf_type = ""

        fechas_json = json_dump([
            {
                "start": event.start,
                "end": event.end,
            }
        ])
        checklist_json = json_dump([
            {
                **item,
                "key": f"{nombre}-{item['key']}",
            }
            for item in DEFAULT_CHECKLIST
        ])
        music_value = event.music if event.music is not None else None
        notes = event.comment or (f"fileRef: '{file_ref}'" if file_ref else "")

        image_rel_path = f"record-images/{idx}/{nombre}.png"
        swf_rel_path = f"swf-files/{idx}/{file_name}" if file_ref else ""

        record = ExportRecord(
            id=idx,
            nombre=nombre,
            status=DEFAULT_STATUS,
            category=event.category,
            fiesta=event.party,
            fechas_json=fechas_json,
            room_label=room_label,
            music=str(music_value) if music_value is not None else None,
            notes=notes,
            image_rel_path=image_rel_path,
            checklist_json=checklist_json,
            credits=DEFAULT_CREDITS,
            swf_type=swf_type,
            swf_rel_path=swf_rel_path,
            file_ref=file_ref,
            frame=event.frame,
            start=event.start,
        )
        records.append(record)

    return records


# ---------------------------------------------------------------------------
# Output helpers: Excel + media assets
# ---------------------------------------------------------------------------
def write_excel(output_path: Path, records: List[ExportRecord]) -> None:
    wb = Workbook()
    ws = wb.active
    ws.title = "Registros"
    ws.append(HEADERS)
    for record in records:
        ws.append(
            [
                str(record.id),
                record.nombre,
                record.status,
                record.category,
                record.fiesta,
                record.fechas_json,
                record.room_label,
                record.music,
                record.notes,
                record.image_rel_path,
                record.checklist_json,
                record.credits,
                record.swf_type,
                record.swf_rel_path,
            ]
        )
    wb.save(output_path)


def resolve_media_source(repo_root: Path, file_ref: str) -> Optional[Path]:
    if ":" not in file_ref:
        return None
    prefix, relative = file_ref.split(":", 1)
    return repo_root / "media" / "default" / prefix / relative


def extract_frames(
    swf_path: Path,
    dest_dir: Path,
    preview_filename: str,
    engine: str,
    frame: Optional[int],
    ffdec: Optional[Path],
    preview_zoom: Optional[float],
) -> None:
    if engine == "none" or extract_swf_frames is None:
        logging.debug("Skipping frame extraction for %s (engine=%s)", swf_path, engine)
        return
    if not swf_path.exists():
        logging.warning("SWF not found for frame export: %s", swf_path)
        return

    target_frame = frame or 1

    def available_ffdec() -> Optional[Path]:
        if ffdec and ffdec.exists():
            return ffdec
        auto = discover_ffdec_path()
        if auto and auto.exists():
            logging.info("Detected ffdec at %s for %s", auto, swf_path.name)
            return auto
        return None

    def run_engine(engine_name: str, tmpdir_path: Path) -> bool:
        try:
            if engine_name == "ffmpeg":
                if not shutil.which("ffmpeg"):
                    return False
                extract_swf_frames.ffmpeg_extract(  # type: ignore[attr-defined]
                    str(swf_path),
                    str(tmpdir_path),
                )
            elif engine_name == "jpexs":
                ffdec_path = available_ffdec()
                if not ffdec_path:
                    logging.warning("JPEXS engine requested but ffdec is not configured for %s", swf_path)
                    return False
                extract_swf_frames.jpexs_extract(  # type: ignore[attr-defined]
                    str(swf_path),
                    str(tmpdir_path),
                    str(ffdec_path),
                    zoom=preview_zoom,
                )
            elif engine_name == "swfrender":
                if not (shutil.which("swfrender") and shutil.which("swfdump")):
                    return False
                extract_swf_frames.swfrender_extract(  # type: ignore[attr-defined]
                    str(swf_path),
                    str(tmpdir_path),
                )
            else:
                logging.warning("Unknown engine '%s' for %s", engine_name, swf_path)
                return False
        except Exception as exc:  # pragma: no cover - passthrough tool failures
            logging.warning("Frame extraction using %s failed for %s: %s", engine_name, swf_path, exc)
            return False

        return any(tmpdir_path.glob("frame_*.png"))

    with TemporaryDirectory() as tmpdir:
        tmpdir_path = Path(tmpdir)
        success = False

        if engine == "auto":
            for candidate in ("ffmpeg", "jpexs", "swfrender"):
                if run_engine(candidate, tmpdir_path):
                    logging.debug("Frame extraction engine for %s: %s", swf_path, candidate)
                    success = True
                    break
        else:
            success = run_engine(engine, tmpdir_path)

        if not success:
            logging.warning("No frame extraction engine available for %s", swf_path)
            return

        frame_candidates = sorted(tmpdir_path.glob("frame_*.png"))
        if not frame_candidates:
            logging.warning("No frames generated for %s", swf_path)
            return

        if dest_dir.exists():
            shutil.rmtree(dest_dir)
        ensure_directory(dest_dir)

        for png_file in frame_candidates:
            shutil.copy2(png_file, dest_dir / png_file.name)

        desired_name = f"frame_{target_frame:05d}.png"
        desired_path = dest_dir / desired_name
        if not desired_path.exists():
            desired_path = dest_dir / frame_candidates[0].name

        preview_path = dest_dir / preview_filename
        if preview_path != desired_path:
            shutil.copy2(desired_path, preview_path)


def copy_assets(
    repo_root: Path,
    output_root: Path,
    records: List[ExportRecord],
    engine: str,
    ffdec: Optional[Path],
    preview_zoom: Optional[float],
) -> None:
    storage_root = output_root / "storage"
    swf_root = storage_root / "swf-files"
    img_root = storage_root / "record-images"
    ffdec_exec = ffdec if ffdec and ffdec.exists() else None
    if ffdec and not ffdec_exec:
        logging.warning("Configured ffdec path is not accessible: %s", ffdec)
    for record in records:
        if not record.file_ref:
            continue
        source = resolve_media_source(repo_root, record.file_ref)
        if source is None or not source.exists():
            logging.warning("Missing SWF for %s (%s)", record.nombre, record.file_ref)
            continue
        dest_swf_dir = swf_root / str(record.id)
        ensure_directory(dest_swf_dir)
        dest_swf = dest_swf_dir / Path(record.swf_rel_path).name
        shutil.copy2(source, dest_swf)

        dest_img_dir = img_root / str(record.id)
        preview_filename = Path(record.image_rel_path).name
        extract_frames(dest_swf, dest_img_dir, preview_filename, engine, record.frame, ffdec_exec, preview_zoom)


def clean_output(output_root: Path) -> None:
    records_path = output_root / "records.xlsx"
    storage_path = output_root / "storage"
    if records_path.exists():
        records_path.unlink()
    if storage_path.exists():
        shutil.rmtree(storage_path)


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------
def main() -> None:
    args = parse_args()
    configure_logging(args.log_level)

    if args.ffdec is None:
        auto_ffdec = discover_ffdec_path()
        if auto_ffdec:
            logging.info("Detected ffdec at %s", auto_ffdec)
            args.ffdec = auto_ffdec
        else:
            logging.debug("No ffdec installation detected automatically")

    if args.ffdec is not None:
        normalized_ffdec = normalize_ffdec_path(args.ffdec)
        if normalized_ffdec is None:
            logging.warning("Unable to resolve a usable ffdec executable from %s", args.ffdec)
            args.ffdec = None
        else:
            if normalized_ffdec != args.ffdec:
                logging.info("Using ffdec executable %s", normalized_ffdec)
            args.ffdec = normalized_ffdec

    repo_root = args.repo_root.resolve()
    output_root = args.output.resolve()
    ensure_directory(output_root)

    if args.clean:
        clean_output(output_root)

    logging.info("Loading game data via ts-node...")
    game_data = call_node_for_data(repo_root)

    logging.info("Processing timelines...")
    temporary_events, base_events = build_events(game_data)
    records = build_records(game_data["rooms"], temporary_events, base_events)

    records_path = output_root / "records.xlsx"
    logging.info("Writing spreadsheet to %s", records_path)
    write_excel(records_path, records)

    if not args.skip_media:
        logging.info("Copying SWFs and generating previews...")
        copy_assets(repo_root, output_root, records, args.engine, args.ffdec, args.preview_zoom)
    else:
        logging.info("--skip-media enabled; skipping SWF copies and previews")

    logging.info("Export completed: %d records", len(records))


if __name__ == "__main__":
    main()
