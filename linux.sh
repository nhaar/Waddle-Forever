#!/bin/bash

VERSION="0.3.1"
URL="https://waddleforever.com"
DEFAULT="default"
CLIENT_URL="https://github.com/nhaar/Waddle-Forever/releases/download/v$VERSION/WaddleForeverClient-$VERSION.AppImage"
SERVER_URL="https://github.com/nhaar/Waddle-Forever/releases/download/v$VERSION/WaddleForeverServer-linux-$VERSION"
DEFAULT_URL="$URL/media/$DEFAULT-$VERSION.zip"
DEST_FOLDER="./Waddle-Forever-$VERSION"
DEFAULT_ZIP="default.zip"

mkdir $DEST_FOLDER

curl -o "$DEST_FOLDER/WaddleForeverClient.AppImage" "$CLIENT_URL" -L
curl -o "$DEST_FOLDER/WaddleForeverServer" "$SERVER_URL" -L

curl -o "$DEFAULT_ZIP" "$DEFAULT_URL" -L
mkdir -p "$DEST_FOLDER/media"
mkdir -p "$DEST_FOLDER/media/default"
unzip "$DEFAULT" -d "$DEST_FOLDER/media/default"
echo "$VERSION" > "$DEST_FOLDER/media/default/.version"
rm "$DEFAULT_ZIP"

echo "{}" > "$DEST_FOLDER/settings.json"

mkdir "$DEST_FOLDER/mods"
echo "" > "$DEST_FOLDER/mods/.active_mods"

echo "Installation finished! Please check details in https://waddleforever.com/linux on how to run the game."
