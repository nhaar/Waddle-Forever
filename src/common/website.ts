import electronIsDev from "electron-is-dev";

export const WEBSITE = electronIsDev ? 'http://localhost:3000' : 'https://waddleforever.com'