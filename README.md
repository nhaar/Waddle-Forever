# Waddle Forever

Waddle Forever está compuesto por un emulador de servidor localhost para Club Penguin y un cliente basado en Electron con el servidor integrado, que permite ejecutar el juego sin configuración adicional. Está construido con Node.js en TypeScript.

Su objetivo principal es ofrecer una experiencia de speedrunning accesible, un sandbox accesible de Club Penguin y, en el futuro, un modo de un solo jugador completo, además del archivo de fiestas y eventos.

> [!IMPORTANT]
> Arvhivos de club penguin rewrittenarchives (https://rewrittenarchives.fandom.com/wiki/Mountain_Expedition_2021)
> Arvhivos de club penguin SWF completo pero sin descarga, pero bien organizado (https://www.clubpenguinwiki.info/wiki/Puffle_Creatures)
> >Permite buscar archivos antiguos (https://web.archive.org/)


> [!IMPORTANT]  
> Los enlaces de descarga están disponibles en el [sitio web](https://waddleforever.com/)

# Progreso

Actualmente, el programa se encuentra en una etapa temprana. Se soporta una jugabilidad básica de “AS2”, incluyendo minijuegos, estampas y personalización del pingüino.

El cliente tiene objetivos ambiciosos, por lo que su cumplimiento no está garantizado. Entre las metas principales se incluyen:

* Ser completamente utilizable para todas las speedruns  
* Permitir explorar cualquier fiesta, evento y punto en la línea de tiempo  
* Facilitar la incorporación de mods  
* Ser utilizable para pequeños servidores para amigos  
* Contar con un mundo de NPCs repartidos por la isla  
* Ofrecer una experiencia completa de un solo jugador y un “modo historia”

Para actualizaciones más detalladas y planes del proyecto, consulta el [servidor de Discord](https://discord.gg/URHXm3cFv5).

# Cómo funciona

El proyecto se compone de dos segmentos:

## Cliente

El cliente utiliza Electron para cargar las páginas web de Club Penguin y ejecutar Flash, de modo que el usuario no deba preocuparse por instalar Flash. Además, el cliente en Electron inicia todos los servidores necesarios, por lo que no hace falta ninguna configuración previa.

## Servidor

En segundo plano, se ejecuta un emulador de servidor de Club Penguin que proporciona toda la funcionalidad del juego. El servidor también puede ejecutarse de forma independiente; en ese caso, el cliente de Electron no es necesario y se pueden abrir varias ventanas para acceder al juego.

> [!CAUTION]  
> El servidor diseñado para este cliente **no** es seguro para multijugador. Puede ser explotado con facilidad, por lo que solo deberías alojarlo para personas de tu confianza.  
> Si deseas crear un CPPS (Club Penguin Private Server), utiliza otro emulador como Houdini.

# Compilación

Para compilar debes tener instalados Node.js, npm y yarn. Tras clonar el repositorio, instala todas las dependencias:

> [!NOTE]  
> Se compiló por última vez con Node.js v20.12.2, NPM v9.8.1 y yarn v1.22.22.


```yarn install```

```yarn build-packages```

Install 22.0.2 de JPEXS FFDec

Create file .env and "write FFDEC_PATH=C:\Program Files (x86)\FFDec\ffdec.bat"


```yarn local-crumbs```
```yarn global-crumbs```
```yarn news-crumbs```

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
