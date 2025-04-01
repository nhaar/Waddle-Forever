#!/bin/bash

VERSION="0.3.0"
URL="https://waddleforever.com"
CLIENT="client"
SERVER="server"
DEFAULT="default"
CLIENT_URL="$URL/$CLIENT-$VERSION-linux.zip"
SERVER_URL="$URL/$SERVER-$VERSION-linux.zip"
DEFAULT_URL="$URL/media/$DEFAULT-$VERSION.zip"
DEST_FOLDER="./Waddle-Forever-$VERSION"
CLIENT_ZIP="client.zip"
SERVER_ZIP="server.zip"
DEFAULT_ZIP="default.zip"

curl -o "$CLIENT_ZIP" "$CLIENT_URL"
curl -o "$SERVER_ZIP" "$SERVER_URL"
curl -o "$DEFAULT_ZIP" "$DEFAULT_URL"

mkdir $DEST_FOLDER

unzip "$CLIENT_ZIP" -d $DEST_FOLDER
unzip "$SERVER_ZIP" -d $DEST_FOLDER

mkdir -p "$DEST_FOLDER/media"
mkdir -p "$DEST_FOLDER/media/default"
unzip "$DEFAULT" -d "$DEST_FOLDER/media/default"

rm "$CLIENT_ZIP"
rm "$SERVER_ZIP"
rm "$DEFAULT_ZIP"

echo "{}" > "$DEST_FOLDER/settings.json"

mkdir "$DEST_FOLDER/mods"
echo "" > "$DEST_FOLDER/mods/.active_mods"
echo "$VERSION" > "$DEST_FOLDER/media/default/.version"

echo "Installation finished! Please check details in https://waddleforever.com/linux on how to run the game."