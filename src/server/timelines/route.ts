import { TimelineMap } from "../game-data";
import { getMediaFilePath, isPathAReference } from "../game-data/files";
import path from "path";
import { Version } from "../routes/versions";
import { getNewspaperName } from "../routes/news.txt";
import { NEWSPAPER_TIMELINE } from "./newspapers";
import { START_DATE } from "./dates";

class FileTimelineMap extends TimelineMap<string, string> {
  protected override processKey(identifier: string): string {
    return sanitizePath(identifier);
  }

  protected override processInformation(info: string): string {
    if (isPathAReference(info)) {
      return getMediaFilePath(info);
    } else {
      return info;
    }
  }

  addStart(route: string, file: string): void {
    this.add(route, file, START_DATE);
  }
}

export function getMinifiedDate(date: Version): string {
  return date.replaceAll('-', '');
}

function addNewspapers(map: FileTimelineMap): void {
  const configXmlPath = getMediaFilePath('tool:news_config.xml');
  NEWSPAPER_TIMELINE.forEach((update, i) => {
    if (typeof update.info === 'string' || 'file' in update.info) {
      const file = typeof update.info === 'string' ? update.info : update.info.file;
      const issue = i + 1;

      // pre-cpip, before rewrite
      map.addStart(`artwork/news/news${issue}.swf`, file);
      // pre-cpip, post rewrite
      const route2007 = getNewspaperName(update.date).replace('|', '/') + '.swf';
      map.addStart(path.join('artwork/news', route2007), file);

      // 2006 boiler room (likely inaccurate, this artwork/archives was probably not a newspaper but a bundle of papers)
      map.addStart(path.join('artwork/archives', `news${issue + 1}.swf`), file);

      // post-cpip
      const date = getMinifiedDate(update.date);
      map.addStart(`play/v2/content/local/en/news/${date}/${date}.swf`, file);
    } else {
      const baseNewsPath = 'play/v2/content/local/en/news/';
      const oldNewsPath = `${baseNewsPath}${getMinifiedDate(update.date)}`;
      const newNewsPath = `${baseNewsPath}papers/${getMinifiedDate(update.date)}`;
      map.addStart(path.join(oldNewsPath, 'config.xml'), configXmlPath);
      map.addStart(path.join(newNewsPath, 'config.xml'), configXmlPath);
      const newspaperComponenets: Array<[string, string]> = [
        ['front/header.swf', update.info.headerFront ?? 'archives:News285HeaderFront.swf'],
        ['front/featureStory.swf', update.info.featureStory],
        ['front/supportStory.swf', update.info.supportStory],
        ['front/upcomingEvents.swf', update.info.upcomingEvents],
        ['front/newsFlash.swf', update.info.newsFlash],
        ['front/askAuntArctic.swf', update.info.askFront],
        ['front/dividers.swf', update.info.dividersFront ?? 'approximation:dividers_blank.swf'],
        ['front/navigation.swf', update.info.navigationFront ?? 'archives:News268NavigationFront.swf'],
        ['back/header.swf', update.info.headerBack ?? 'archives:News285HeaderBack.swf'],
        ['back/askAuntArctic.swf', update.info.askBack],
        ['back/secrets.swf', update.info.secrets ?? 'archives:News285Secrets.swf'],
        ['back/submitYourContent.swf', update.info.submit ?? 'archives:News268SubmitYourContent.swf'],
        ['back/jokesAndRiddles.swf', update.info.jokes ?? 'archives:News285JokesAndRiddles.swf'],
        ['back/dividers.swf', update.info.dividersBack ?? 'approximation:dividers_blank.swf'],
        ['back/navigation.swf', update.info.navigationBack ?? 'archives:News268NavigationBack.swf']
      ]
      if (update.info.answers !== undefined) {
        newspaperComponenets.push(['overlays/riddlesAnswers.swf', update.info.answers]);
      }
      if (update.info.extraJokes !== undefined) {
        newspaperComponenets.push(['overlays/extraJokes.swf', update.info.extraJokes]);
      }
      if (update.info.secret !== undefined && update.info.secret !== null) {
        newspaperComponenets.push(['overlays/secret.swf', update.info.secret]);
      }
      if (update.info.iglooWinners !== undefined) {
        newspaperComponenets.push(['overlays/iglooWinners.swf', update.info.iglooWinners]);
      }
      if (update.info.featureMore !== undefined) {
        newspaperComponenets.push(['overlays/featureMore.swf', update.info.featureMore ?? 'archives:News284FeatureMore.swf']);
      }
      if (update.info.supportMore !== undefined) {
        newspaperComponenets.push(['overlays/supportMore.swf', update.info.supportMore ?? 'archives:News282SupportMore.swf']);
      }
      if (update.info.extra !== undefined) {
        newspaperComponenets.push(['overlays/extra.swf', update.info.extra]);
      }
      
      newspaperComponenets.forEach((pair) => {
        const [route, file] = pair;
        map.addStart(path.join(oldNewsPath, 'content', route), getMediaFilePath(file));
        map.addStart(path.join(newNewsPath, 'content', route), getMediaFilePath(file));
      }) 
      }
  });
}

function sanitizePath(path: string): string {
  return path.replaceAll('\\', '/');
}

/** Get the object which knows all the file information needed to find the file for a given route */
export function getRoutesTimeline() {
  const timelines = new FileTimelineMap();

  const timelineProcessors = [
    // pins are specifically before party so that pins that update with a party don't override the party room
    addNewspapers
  ];

  timelineProcessors.forEach((fn) => fn(timelines));
  
  const fileServer = timelines.getVersionsMap();

  return fileServer;
}