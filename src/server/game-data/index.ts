import { iterateEntries } from "../../common/utils";
import { isEqual, isLower, Version } from "../routes/versions"
import { FileRef } from "./files";

/** A map that takes as keys a game route and as values a file reference. Works as static serving for a single point in time */
export type RouteRefMap = Record<string, FileRef>;

/**
 * A map that takes as keys versions, and as values information of a certain type, used for
 * permanent changes
 * */
export type DateMap<Info> = Record<Version, Info>;

/** A map that takes as keys an ID number (of any kind) and values a file reference associated with the ID */
export type IdRefMap = Record<number, FileRef>;

/**
 * A permanent change is one in which when it is implemented, there is no plan to go
 * back on the change
 * Type represents a permanent change
 * */
type PermanentChange<ChangeInformation> = {
  /** Date this change was implemented */
  date: Version;
  /** All information associated with the change */
  info: ChangeInformation
};

/** 
 * A temporary change is one in which you plan to revert back to the initial stage once
 * after a time period
 * Type represents a temporary change
 * */
export type TemporaryChange<ChangeInformation> = {
  /** Date this change is first introduced */
  date: Version;
  /** Date this change is removed */
  end: Version;
  /** All information associated with the change */
  info: ChangeInformation;
  /**
   * A series of changes that happen in the middle of this temporary update
   * at dates other than the start date, which all disappear when this update goes away
   */
};

/** A singular update on a timeline of events that are either permanent or temporary */
export type TimelineEvent<ChangeInformation> = PermanentChange<ChangeInformation> | TemporaryChange<ChangeInformation>;

/**
 * A complex implementation of a temporary change, which can be accompanied with sub-updates, as well as permanent updates
 * that could happen at the start or end of this temporary change
 * */
export type ComplexTemporaryUpdate<UpdateInformation> = {
  date: Version;
  end: Version;
  /** All updates that happen within this temporary update */
  updates?: Array<{
    /** If not added, then it defaults to the start of the temporary update */
    date?: Version;
    /** If not supplied, ends when the next update shows, if null, ends when the whole group ends, otherwise the value stated */
    end?: Version | null
  } & UpdateInformation>;
  /** Permanent changes applied at the beginning of this update */
  permanentChanges?: UpdateInformation;
  /** Permanent changes applied at the end of this update */
  consequences?: UpdateInformation;
} & UpdateInformation;

/** List of many implementations of temporary updates */
export type ComplexTemporaryUpdateTimeline<UpdateInformation> = Array<ComplexTemporaryUpdate<UpdateInformation>>;

/**
 * Takes an unorganized sequence of temporary and permanent changes, and processes it into a sorted organized output
 * representing a full timeline of changes
 * @param timeline The timeline of events
 * @param getInput A function that takes each event and gets characteristic input data that is meant to be particular of each event
 * @param getOutput A function that takes a previous event's input data, or none if nothing previous, and the current event input data and outputs a final output
 * @param hashOutput A function that creates a unique identifier for a given output, to be able to hash it
 * @param complexTimeline If true, the timeline is a complex one (ie. with multiple features updating in parallel, eg. crumbs), in that case, temporary updates are not allowed since they would impede some permament updates from being implemented, thus all timelines used are expected to be already processed.
 * @returns 
 */
export function processTimeline<EventInformation, EventInput, EventOutput>(
  timeline: TimelineEvent<EventInformation>[],
  getInput: <T extends EventInformation>(input: T) => EventInput,
  getFirstOutput: () => EventOutput,
  getOutput: (prev: EventOutput, cur: EventInput) => EventOutput,
  hashOutput: (out: EventOutput) => string,
  complexTimeline: boolean = true
): Array<{
  date: Version,
  out: EventOutput,
  id: number
}> {
  // first part of this algorithm:
  // labeling what each update is and breaking everything down
  // to events
  
  // get id of event input so we can find them later
  const permanentMapping = new Map<number, EventInput>();
  const temporaryMapping = new Map<number, EventInput>();

  // further splitting temporary updates into start and end
  const eventsTimeline: Array<{
    type: 'permanent' | 'temp_start' | 'temp_end',
    id: number;
    date: Version;
  }> = [];

  let currentId = 0;

  timeline.forEach((event) => {
    // temporary updates
    const input = getInput(event.info);
    if ('end' in event) {
      if (complexTimeline) {
        throw new Error('Complex timelines cannot have temporary updates');
      }
      currentId++;
      temporaryMapping.set(currentId, input);
      eventsTimeline.push({
        type: 'temp_start',
        id: currentId,
        date: event.date
      }, {
        type: 'temp_end',
        id: currentId,
        date: event.end
      });
    } else {
      currentId++;
      permanentMapping.set(currentId, input);
      eventsTimeline.push({
        type: 'permanent',
        id: currentId,
        date: event.date
      });
    } 
  });

  // sorting by the date
  // if on the same day, the priority is permanent->temp end->temp start
  // because if a permanent update is after the temporary, then it won't be added
  const sorted = eventsTimeline.sort((a, b) => {
    const aVersion = a.date;
    const bVersion = b.date;
    if (isLower(aVersion, bVersion)) {
      return -1;
    } else if (isEqual(aVersion, bVersion)) {
      if (a.type === b.type) {
        return 0;
      }
      if (a.type === 'permanent') {
        return -1;
      }
      if (b.type === 'permanent') {
        return 1;
      }
      if (a.type === 'temp_end') {
        return -1;
      }
      if (b.type === 'temp_end') {
        return 1;
      }
      return 0;
    } else {
      return 1;
    }
  });

  // second part of this algorithm: going through the events
  // and processing what the output is meant to look like

  let previousPermanent = -1;
  let currentPermanent = -1;
  // this acts as a queue, so there can be multiple temporary events
  let currentTemporaries: number[] = [];

  // we will assign IDs to the output so that we can tell which of the outputs
  // represent the exact same state (discerned via the "hashing" function)
  let outputId = 0;
  const outputs = new Map<string, number>();

  const getOutputId = (output: EventOutput) => {
    const hash = hashOutput(output);
    const id = outputs.get(hash);
    
    if (id === undefined) {
      outputId++;
      outputs.set(hash, outputId);
      return outputId;
    } else {
      return id;
    }
  }

  // maps id of permanent update and the output generated by it
  const outputMapping = new Map<number, EventOutput>();
  
  const getPrevious = (date: Version) => {
    let previous = versionMapping.get(date);
    if (previous !== undefined) {
      return previous;
    }
    previous = outputMapping.get(previousPermanent);
    if (previous === undefined) {
      return getFirstOutput();
    }
    return previous;
  }

  const versionMapping = new Map<Version, EventOutput>();

  const pushPermanent = (date: string) => {
    const input = permanentMapping.get(currentPermanent);
    if (input !== undefined) {
      const output = getOutput(getPrevious(date), input);
      outputMapping.set(currentPermanent, output);
      versionMapping.set(date, output);
    }
  }

  const pushTemporary = (date: string) => {
    const currentTemporary = currentTemporaries[0];
    const input = temporaryMapping.get(currentTemporary);
    if (input === undefined) {
      throw new Error('Logic error');
    }
    const output = getOutput(getPrevious(date), input);
    versionMapping.set(date, output);
  }

  sorted.forEach((event) => {
    if (event.type === 'permanent') {
      previousPermanent = currentPermanent;
      currentPermanent = event.id;
      // permanent changes take effect once the temporaries are gone
      if (currentTemporaries.length === 0) {
        pushPermanent(event.date);
      }
    } else if (event.type === 'temp_start') {
      currentTemporaries.unshift(event.id);
      pushTemporary(event.date);
    } else if (event.type === 'temp_end') {
      currentTemporaries = currentTemporaries.filter((id) => id !== event.id);
      if (currentTemporaries.length === 0) {
        pushPermanent(event.date);
      } else {
        pushTemporary(event.date);
      }
    }
  });

  const versions: Array<{ 
    date: Version
    out: EventOutput
    id: number
  }> = (Array.from(versionMapping.entries()).map((pair) => {
    const [date, out] = pair;
    const id = getOutputId(out);
    return { date, out, id };
  })).sort((a, b) => {
    const aVersion = a.date;
    const bVersion = b.date;
    if (isLower(aVersion, bVersion)) {
      return -1;
    } else if (isEqual(aVersion, bVersion)) {
      return 0;
    } else {
      return 1;
    }
  })

  return versions;
}

/**
 * A sorted array which represents how an information changes through time
 * Each new element means that the information mutates on that given date
 * */
export type VersionsInformation<EventInformation> = Array<{
  date: Version;
  info: EventInformation;
}>;

/**
 * Process a timeline of events which are independent of each other
 * This means for example that the previous update's information is not used at all
 * in the next update
 * @param timeline 
 * @returns 
 */
export function processIndependentTimeline<EventInformation>(timeline: TimelineEvent<EventInformation>[]): VersionsInformation<EventInformation> {
  // filter things out with undefined, it should not be possible for the output to have undefineds
  // on the way this is setup, IF USING UNDEFINED FOR EVENTINFORMATION consider using null otherwise it will break!
  const versions = processTimeline<EventInformation, EventInformation, undefined | EventInformation>(timeline, (input) => {
    return input;
  }, () => {
    return undefined
  }, (_, c) => c, (out) => out === undefined ? '' : JSON.stringify(out), false);

  const cleanVersions: VersionsInformation<EventInformation> = [];
  versions.forEach((version) => {
    if (version.out !== undefined) {
      cleanVersions.push({ date: version.date, info: version.out });
    }
  })

  return cleanVersions;
}

/**
 * Given an array of sorted versions, find what is active in the given date
 * @param date 
 * @param versions 
 * @returns undefined if it underflows (date is before first update)
 */
export function findInVersion<EventInformation>(date: Version, versions: VersionsInformation<EventInformation>) {
  return findInVersionFull(date, versions)?.info;
}

export function findInVersionFull<EventInformation>(date: Version, versions: VersionsInformation<EventInformation>) {
  if (versions.length === 1) {
    return versions[0];
  }
  
  const index = findEarliestDateHitIndex(date, versions);
  if (index === -1) {
    return undefined;
  }
  
  return versions[index];
}

/**
 * Search in a sorted array of dates what index is the earliest to be compatible or -1 if it underflows
 * If there is only one element, it always returns it
 * @param date 
 * @param array Sorted array by date
 * @returns 
 */
export function findEarliestDateHitIndex<T extends { date: Version }>(date: Version, array: T[]): number {
  if (array.length < 2) {
    if (array.length === 1) {
      if (isLower(date, array[0].date)) {
        return -1
      } else {
        return 0;
      }
    } else {
      // empty array
      return -1;
    }
  }

  let left = 0;
  // the last index is not allowed since we search in pairs
  // and then -1 because length is last index + 1
  let right = array.length - 2;
  let index = -1;
  
  // this is a type of binary search implementation
  while (true) {
    // this means that was lower than index 0
    if (right === -1) {
      index = -1;
      break
    } else if (left === array.length - 1) {
      // this means that was higher than last index
      index = left;
      break;
    }
    const middle = Math.floor((left + right) / 2);
    const element = array[middle];
    if (isLower(date, element.date)) {
      // middle can't be it, but middle - 1 could still be
      right = middle - 1;
    } else if (isLower(date, array[middle + 1].date)) {
      index = middle;
      break;
    } else {
      left = middle + 1;
    }
  }

  return index;
}

/** Map of things that map to many versions */
export type VersionsMap<Key, EventInformation> = Map<Key, VersionsInformation<EventInformation>>;

/** Given a route map, adds file information to a given route */
export function addToVersionsMap<Key, EventInformation>(
  map: VersionsMap<Key, EventInformation>,
  key: Key,
  info: { date: Version; info: EventInformation }[]
): void {
  const previousValue = map.get(key);
  if (previousValue === undefined) {
    map.set(key, info);
  } else {
    console.log(previousValue, info);
    throw new Error(`${key} is being duplicated`);
  }
}

/** Class handles a timeline of versions */
export class VersionsTimeline<EventInformation> {
  private _eventsTimeline: TimelineEvent<EventInformation>[];
  
  constructor() {
    this._eventsTimeline = [];
  }

  /** Adds all events from a date map */
  addDateMap(dateMap: DateMap<EventInformation>) {
    iterateEntries(dateMap, (date, info) => {
      this.add({ date, info });
    });
  }

  /** Add an event to the timeline */
  add(event: TimelineEvent<EventInformation>) {
    this._eventsTimeline.push(event);
  }

  /** Get sorted versions array */
  getVersions() {
    return processIndependentTimeline(this._eventsTimeline);
  }
}

/** Class handles an object that maps things to timelines */
export class TimelineMap<Key, EventInformation> {
  private _map: Map<Key, VersionsTimeline<EventInformation>>;
  private _hasDefault: boolean = false;
  private _default: EventInformation | undefined;
  private _defaultVersion: Version | undefined;
  
  constructor(defaultInfo?: { value: EventInformation, date: Version }) {
    this._map = new Map<Key, VersionsTimeline<EventInformation>>;
    if (defaultInfo !== undefined) {
      this._hasDefault = true;
      this._default = defaultInfo.value;
      this._defaultVersion = defaultInfo.date;
    }
  }

  /** Inherit to make changes to the key input */
  protected processKey(key: Key): Key {
    return key;
  }

  /** Inherit to make changes to the information input */
  protected processInformation(info: EventInformation): EventInformation {
    return info;
  }

  /**
   * Consumes a date map onto a timeline
   * @param key 
   * @param dateMap 
   */
  addDateMap(key: Key, dateMap: DateMap<EventInformation>): void {
    this.updateTimeline(key, (t) => t.addDateMap(dateMap));
  }

  /**
   * Updates the timeline of a member of the map
   * @param key 
   * @param updater 
   */
  updateTimeline(key: Key, updater: (timeline: VersionsTimeline<EventInformation>) => void) {
    key = this.processKey(key);
    let timeline = this._map.get(key);
    if (timeline === undefined) {
      timeline = new VersionsTimeline<EventInformation>();
    }

    updater(timeline);
    this._map.set(key, timeline);
  }

  /** Add event to a timeline */
  add(key: Key, info: EventInformation, date: Version, end: Version | undefined = undefined): void {
    key = this.processKey(key);
    const event = end === undefined ? { date, info } : { date, end, info };
    event.info = this.processInformation(event.info);
    const prev = this._map.get(key);
    if (prev === undefined) {
      const timeline = new VersionsTimeline<EventInformation>();

      if (this._hasDefault && this._defaultVersion !== undefined && this._default !== undefined) {
        timeline.add({ date: this._defaultVersion, info: this._default });
      }

      timeline.add(event);
      this._map.set(key, timeline);
    } else {
      prev.add(event);
    }
  }

  /** Get processed version maps with sorted timelines */
  getVersionsMap(): Map<Key, VersionsInformation<EventInformation>> {
    const map = new Map<Key, VersionsInformation<EventInformation>>();
    this._map.forEach((timeline, route) => {
      addToVersionsMap(map, route, timeline.getVersions());
    });

    return map;
  }
}

/**
 * Represents a valid migrator visit. `true` means that a visit happens but the catalog is not updated,
 * if the catalog is updated, the catalog's file is listed
 * */
export type MigratorVisit = true | FileRef;