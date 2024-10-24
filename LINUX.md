# Playing Waddle Forever in Linux

This is a tutorial which assumes you have already installed the game, if you haven't done it, do so in https://waddleforever.com/.

# Requirements

The game uses an AppImage, so you need to install FUSE in order to run it. In some Linux distributions, this already comes packaged, but if you don't have it, [here's the tutorial for installing it](https://github.com/appimage/appimagekit/wiki/fuse).

# Finishing installation

After installing, you must first open the folder you installed and then open the terminal, and then run these commands:

```chmod +x ./WaddleForeverServer```
```chmod +x ./WaddleForeverClient.AppImage```

# Running the game

Everytime you want to run, you must first open a terminal in the game folder and run:

```sudo ./WaddleForeverServer```

After that is running, then you can go ahead and run the game, which is located in `WaddleForeverClient.AppImage`. A message will pop up. Click to run it serverless.
