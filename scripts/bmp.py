"""
Use this to convert a BMP into a matrix where each tile represents a walkable "pixel" of a room

required packages:

pip install Pillow
"""
from PIL import Image
import sys
from pathlib import Path

COLOR_BLOCK = 153

def read_file(name: str) -> Image:
    return Image.open(name).convert("RGB")

PixelRow = list[tuple[int, int, int]]
PixelMatrix = list[PixelRow]
BooleanRow = list[int]
BooleanMatrix = list[BooleanRow]

def get_pixel_matrix(img: Image) -> PixelMatrix:
    width, height = img.size

    pixel_matrix = []
    for y in range(height):
        row = []
        for x in range(width):
            color = img.getpixel((x, y))
            row.append(color)
        pixel_matrix.append(row)

    return pixel_matrix

def convert_row(row: PixelRow) -> BooleanRow:
    lst = list(map(
        lambda x: 1 if x[0] == 255 else 0, row
    ))
    lst.pop()
    return lst

def get_boolean_matrix(
        pixel_matrix: PixelMatrix
    ) -> BooleanMatrix:
    height = len(pixel_matrix)
    width = len(pixel_matrix[0])
    if (height != 481 and width != 761):
        raise Exception(f'Incorrect dimensions: {width}x{height}')

    boolean_matrix = list(pixel_matrix)
    boolean_matrix.pop()
    boolean_matrix = list(map(convert_row, boolean_matrix))

    return boolean_matrix

def change_resolution(
      boolean_matrix: BooleanMatrix,
      downscale: int
    ) -> BooleanMatrix:
    if (downscale < 2):
        raise Exception('Downscale must be of 2 or more')
    height = len(boolean_matrix)
    width = len(boolean_matrix[0])

    if height % downscale != 0 and width % downscale != 0:
        raise Exception('Downscale must divide width and height')

    # Virtually allowed:
    # 2, 3, 4, 5, 6, 8, 10, 12, 15, 16, 20, 24, 30, 40, 48, 60, 80, 120, 240
    new_height = height // downscale
    new_width = width // downscale
    new_matrix = [[0 for j in range(new_width)] for i in range(new_height)]
    for i in range(new_height):
        for j in range(new_width):
            values = []
            for x in range(downscale):
                for y in range(downscale):
                    values.append(boolean_matrix[i * downscale + x][j * downscale + y])
                if 1 in values:
                    new_matrix[i][j] = 1

    return new_matrix

def bool_array_to_bmp(array, path):
    height = len(array)
    width = len(array[0])

    image = Image.new("1", (width, height))

    pixels = image.load()
    for y, row in enumerate(array):
        for x, value in enumerate(row):
            pixels[x, y] = value

    image.save(path, format="BMP")

def bool_array_to_ts(array, path):
    with open(path, 'w') as f:
        f.write(str(array))

# Example: Print the color of the top-left pixel
# print()

def main():
    if (len(sys.argv) != 4):
        print(
            f"Usage: {sys.argv[0]} bmp_path <2, 3, 4, 5, 6, 8, 10, 12, 15, 16, 20, 24, 30, 40, 48, 60, 80, 120, 240> output"
        )
        sys.exit(1)

    bmp = Path(sys.argv[1]).resolve()
    downscale = int(sys.argv[2])
    output = Path(sys.argv[3]).resolve()

    bool_matrix = change_resolution(get_boolean_matrix(get_pixel_matrix(read_file(bmp))), downscale)
    bool_array_to_ts(bool_matrix, output)

if __name__ == "__main__":
    main()
