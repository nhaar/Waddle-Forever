import { BrowserWindow } from "electron";
import path from "path";
// note: need to use a really old version of marked to allow it to work
// with electron's older node version, and it doesn't ship with typings unfortunately
import { marked } from "marked";
import { promises as fs } from "fs";
import { pathToFileURL } from "url";
import { getPopupCreator } from "@client/popups";
import { IS_DEV } from "@common/constants";

/**
 * Returns a popup from `getPopupCreator`, to display markdown content
 * @param name - Name for the popup
 * @param md - Name of the .md file in the `guide` directory (don't include ".md")
 * @param title - The title for the popup window
 */
const createMarkdownViewer = (name: string, md: string, title: string) => {
  return getPopupCreator(name, ['get-markdown'], (mainWindow) => {
    const win = new BrowserWindow({
      width: 600,
      height: 700,
      minHeight: 100,
      minWidth: 100,
      title,
      webPreferences: {
        preload: path.join(__dirname, 'mdviewer-preload.js')
      },
      resizable: true,
      parent: mainWindow
    });

    win.setMenu(null);

    win.loadFile(path.join(__dirname, 'mdviewer.html'));

    win.webContents.on('did-finish-load', async () => {
      const mdFilePath = IS_DEV
        ? path.join(process.cwd(), 'guide', `${md}.md`)
        : path.join(process.resourcesPath, 'app', 'compiled', 'guide', `${md}.md`);
      const mdFile = await fs.readFile(mdFilePath);

      const renderer = new marked.Renderer();
      const renderImage = renderer.image;
      renderer.image = (href: string, title: string, text: string) => {
        const imageUrl = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href)
          ? href
          : new URL(href, pathToFileURL(mdFilePath).href).href;
        return renderImage.call(renderer, imageUrl, title, text);
      };

      win.webContents.send('get-markdown', await marked.parse(mdFile.toString(), { renderer }));
    });

    return win;
  })
}

export const createModsGuide = createMarkdownViewer('modsguide', 'MODS', 'Mods Help');