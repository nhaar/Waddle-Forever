# Playing Waddle Forever in Linux

# Installation
Run this command (you need `curl` installed):

(Please make sure to run this command in the terminal inside the folder you want the game to be installed on)

```bash
bash <(curl -s https://raw.githubusercontent.com/nhaar/waddle-forever-installer/master/install.sh)
```

# Requirements

The game uses an AppImage, so you need to install FUSE in order to run it. In some Linux distributions, this already comes packaged, but if you don't have it, [here's the tutorial for installing it](https://github.com/appimage/appimagekit/wiki/fuse).

# Finishing installation

After installing, you must first open the folder you installed and then open the terminal, and then run these commands:

```bash
chmod +x ./WaddleForeverServer
```
```bash
chmod +x ./WaddleForeverClient.AppImage
```

# Running the game

Everytime you want to run, you must first open a terminal in the game folder and run:

```bash
sudo ./WaddleForeverServer
```

After that is running, then you can go ahead and run the game, which is located in `WaddleForeverClient.AppImage`. A message will pop up. Click to run it serverless.
