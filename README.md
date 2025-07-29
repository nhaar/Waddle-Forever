[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/Valverde-101/Waddle-Forever-Leo)

## ⚠️ Aviso sobre Archivos SWF

Este proyecto NO incluye directamente ningún archivo SWF oficial de Club Penguin (propiedad de Disney), todo los swf
son recreaciones hechas de CERO. Para ejecutar el proyecto:

1. Descarga e instala Club Penguin desde [fuente oficial].
2. Extrae los archivos SWF desde tu copia local (siguiendo la guía provista aquí [enlace a instrucciones detalladas]).

**Nota**: Este repositorio es solo para fines educativos y de desarrollo personal. No aloja ni distribuye activos protegidos por derechos de autor.

© Disney. Todos los derechos reservados.

# Waddle Forever

Waddle Forever is composed of a localhost server emulator for Club Penguin and an Electron client with the server that can run the game out of the box, built with Node.js in TypeScript.

Its main goals are accessible speedrunning, accessible sandbox Club Penguin and in the future for a complete singleplayer experience and archival of parties and events.

> [!IMPORTANT]  
> Download links are available in the [website!](https://waddleforever.com/)

# Progress

At the moment, the program is at an early stage. A basic "AS2" gameplay is currently supported, including minigames, stamps and penguin customization.

The client has ambitious goals, so it is uncertain if they will be met. The main goals include:

* Be fully useable for all speedruns
* Allow exploring any party, event and timestamp in the timeline
* Allow adding mods easily
* Useable for small servers hosted for friends
* Have a world of NPCs over the island
* Have a complete singleplayer experience and "story mode"

For more detailed updates and plans for the project, check out the [Discord server](https://discord.gg/URHXm3cFv5).

# How it works

The project is composed of two segments:

## Client

Its client uses Electron to read the webpages for Club Penguin and run Flash, so the user does not need to worry about installing Flash. The a
Electron client runs all the servers it will access, so there is no need to setup.

## Server

Under the hood, a Club Penguin server emulator runs to give full functionality to the game. The server can also be run standalone, in which case the Electron client is not needed, and you can use multiple windows to access the game.

> [!CAUTION]
> The server made for this client is not safe for multiplayer! It can be exploited easily so only host it to people you trust.
> If you wish to make a CPPS, use a different emulator like Houdini.

# Building

To build you must have Node.js, npm and yarn installed. After cloning the code, install all dependencies:

> [!NOTE]  
> Last built using Node.js v20.12.2, NPM v9.8.1, yarn v1.22.22

```yarn install```

For running the client in development, run

```yarn start```

For running the server in development, run

```yarn dev```

The game is built into zip files which are placed in the website. To build the zip files:

```yarn build-media```
```yarn build-win```

Will leave all the files in the folder `zip`

# Credits

The Electron client is originally forked from the [Club Penguin Avalanche client](https://github.com/Club-Penguin-Avalanche/CPA-Client).

The server, code and setup sources a lot of things from the [Houdini](https://github.com/solero/houdini) and [Mammoth](https://github.com/wizguin/mammoth) server emulators. Special thanks to all of the developers of those repositories for making it open sourced and contributing to the community.

Special thanks to charlotte, who made CPSC, the original singleplayer/speedrunning client.

Credits to Ben for developing the Scavenger Hunt dependency and dynamic Igloo List. Credits for Randomno for the modified igloo list.

Special thanks for continued support, recreating, researching and or testing the game to: supermanover, Blue Kirby, Jeff The Rock, Resol van Lemmy, VampLovr, ungato, Zeldaboy, Ryboflavin, Bluestk, Levi
