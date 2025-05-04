#!/bin/bash

VERSION="1.1.1"
URL="https://waddleforever.com"
DEFAULT="default"
CLIENT_URL="https://github.com/nhaar/Waddle-Forever/releases/download/v$VERSION/WaddleForeverClient-$VERSION.AppImage"
DEFAULT_URL="$URL/media/$DEFAULT-$VERSION.zip"
DEST_FOLDER="./Waddle-Forever-$VERSION"
DATA_FOLDER="$HOME/.waddleforever"
DEFAULT_ZIP="default.zip"

mkdir $DEST_FOLDER

curl -o "$DEST_FOLDER/WaddleForeverClient.AppImage" "$CLIENT_URL" -L

curl -o "$DEFAULT_ZIP" "$DEFAULT_URL" -L
mkdir -p "$DEST_FOLDER/media"
mkdir -p "$DEST_FOLDER/media/default"
unzip "$DEFAULT" -d "$DEST_FOLDER/media/default"
echo "$VERSION" > "$DEST_FOLDER/media/default/.version"
rm "$DEFAULT_ZIP"

mkdir $DATA_FOLDER

SETTINGS_PATH="$DATA_FOLDER/settings.json"
if [ ! -f $SETTINGS_PATH ]; then
    echo "{}" > $SETTINGS_PATH
fi

mkdir "$DATA_FOLDER/mods"

ACTIVE_MODS_PATH="$DATA_FOLDER/mods/.active_mods"
if [ ! -f $ACTIVE_MODS_PATH ]; then
    echo "" > $ACTIVE_MODS_PATH
fi

chmod +x "$DEST_FOLDER/WaddleForeverClient.AppImage"

echo "Installation finished! Please check details in https://waddleforever.com/linux on how to run the game."
