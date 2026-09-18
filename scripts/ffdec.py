"""
Use this to export a SWF's block_mc into a BMP
This is used to fetch the walkable coordinates of a room
"""

import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import TypedDict

def run_ffdec(ffdec: str, *args: str) -> None:
    result = subprocess.run(
        [ffdec, *args],
        capture_output=True,
        text=True,
    )

    if result.returncode != 0:
        print(result.stdout)
        print(result.stderr, file=sys.stderr)
        raise RuntimeError("FFDec failed")


def get_character_id(item: ET.Element) -> int | None:
    value = item.get("characterId")

    if value is None:
        return None

    return int(value)


def build_character_map(root: ET.Element) -> dict[int, ET.Element]:
    """
    Build:

        character ID -> XML definition

    for sprites and shapes.
    """

    characters = {}

    for item in root.iter("item"):
        item_type = item.get("type")

        if item_type == "DefineSpriteTag":
            sprite_id = item.get("spriteId")

            if sprite_id is not None:
                characters[int(sprite_id)] = item

        elif item_type in {
            "DefineShapeTag",
            "DefineShape2Tag",
            "DefineShape3Tag",
            "DefineShape4Tag",
        }:
            shape_id = item.get("shapeId")

            if shape_id is not None:
                characters[int(shape_id)] = item

    return characters

class Tag(TypedDict):
    name: str
    character_id: int


def find_blocks(root: ET.Element[str]) -> list[Tag]:
    """
    Find PlaceObject2Tag instances named block/block_mc.
    """

    blocks: list[Tag] = []

    for item in root.iter("item"):
        if item.get("type") != "PlaceObject2Tag":
            continue

        if item.get("name") not in {"block", "block_mc"}:
            continue

        character_id = get_character_id(item)

        if character_id is None:
            continue

        blocks.append({
            "name": item.get("name"),
            "character_id": character_id
        })

    return blocks


def resolve_shape(character_id: int, characters: dict[int, ET.Element]) -> int:
    """
    Follow:

        Sprite -> PlaceObject2Tag -> character -> Sprite/Shape

    until a DefineShapeTag is found.
    """

    visited = set()

    while True:
        if character_id in visited:
            raise RuntimeError(
                f"Character reference cycle detected at {character_id}"
            )

        visited.add(character_id)

        item = characters.get(character_id)

        if item is None:
            raise RuntimeError(
                f"Could not find character {character_id}"
            )

        item_type = item.get("type")

        # We reached the actual shape.
        if item_type in {
            "DefineShapeTag",
            "DefineShape2Tag",
            "DefineShape3Tag",
            "DefineShape4Tag",
        }:
            return character_id

        # A sprite contains PlaceObject tags which reference
        # the actual characters used inside it.
        if item_type == "DefineSpriteTag":
            for child in item.iter("item"):
                if child.get("type") != "PlaceObject2Tag":
                    continue

                child_character_id = get_character_id(child)

                if child_character_id is not None:
                    character_id = child_character_id
                    break
            else:
                raise RuntimeError(
                    f"Sprite {character_id} contains no "
                    "PlaceObject2Tag with a characterId"
                )

            continue

        raise RuntimeError(
            f"Character {character_id} has unexpected type "
            f"{item_type}"
        )


def main():
    if len(sys.argv) != 4:
        print(
            f"Usage: {sys.argv[0]} ffdec_path input.swf output_directory"
        )
        sys.exit(1)

    ffdec = Path(sys.argv[1]).resolve()
    swf = Path(sys.argv[2]).resolve()
    output = Path(sys.argv[3]).resolve()

    output.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory() as temp:
        xml_file = Path(temp) / "movie.xml"

        print("Converting SWF to XML...")

        run_ffdec(
            ffdec,
            "-swf2xml",
            str(swf),
            str(xml_file),
        )

        root = ET.parse(xml_file).getroot()

        characters = build_character_map(root)
        blocks = find_blocks(root)

        print(f"Found {len(blocks)} block instance(s).")

        exported_shapes = set()

        for block in blocks:
            name = block["name"]
            character_id = block["character_id"]

            print(
                f"\n{name}: character {character_id}"
            )

            try:
                shape_id = resolve_shape(
                    character_id,
                    characters,
                )
            except RuntimeError as e:
                print(f"  ERROR: {e}")
                continue

            print(f"  -> shape {shape_id}")

            # Multiple frames may use the same shape.
            if shape_id in exported_shapes:
                print("  -> already exported")
                continue

            exported_shapes.add(shape_id)

            destination = output / f"{name}_{shape_id}"
            destination.mkdir(exist_ok=True)

            print(
                f"  -> exporting to {destination}"
            )

            run_ffdec(
                ffdec,
                "-format",
                "shape:bmp",
                "-selectid",
                str(shape_id),
                "-export",
                "shape",
                str(destination),
                str(swf),
            )

    print("\nDone.")


if __name__ == "__main__":
    main()