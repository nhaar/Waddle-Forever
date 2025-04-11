import { GameVersion } from "../settings";

/** Valid month initials for versions (same capitalization must be used) */
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

/** Returns undefined if an invalid version, otherwise an array [year, month, day] */
function decomposeVersion(version: string): [number, number, number] | undefined {
  if (version.length !== 11) {
    return;
  }

  const yearText = version.slice(0, 4);
  const monthText = version.slice(5, 8);
  const dayText = version.slice(9, 11);

  const year = Number(yearText);
  // XX day marks that we don't know the exact day, we assume first of the month.
  const day = dayText === 'XX' ? 1 : Number(dayText);

  if (isNaN(year) || isNaN(day)) {
    return;
  }
  // same as above, but with three 'X' for the month
  const monthIndex = monthText === 'XXX' ? 0 : MONTHS.indexOf(monthText);
  if (monthIndex === -1) {
    return;
  }

  if (year < 2005 || year > 2017) {
    return;
  }

  const date = new Date(year, monthIndex, day);
  if (isNaN(date.getTime())) {
    return;
  }

  return [year, monthIndex + 1, day];
}

/** Get object with year, month and day of the version */
function getVersionDetails(version: string): {
  year: number,
  month: number,
  day: number
} {
  const decomposed = decomposeVersion(version);

  if (decomposed === undefined) {
    throw new Error(`Invalid version date being processed: ${version}`);
  }

  const [year, month, day] = decomposed;

  return {
    year,
    month,
    day
  };
}

/** Sort an array of versions from earliest to latest */
export function sortVersions(versions: string[]): void {
  versions.sort((a, b) => {
    if (isLower(a, b)) {
      return -1;
    } else if (isEqual(a, b)) {
      return 0;
    } else {
      return 1;
    }
  })
}

function isEqual(left: string, right: string): boolean {
  const leftDetails = getVersionDetails(left);
  const rightDetails = getVersionDetails(right);

  return leftDetails.year === rightDetails.year && leftDetails.day === rightDetails.day && leftDetails.month === rightDetails.month
}

export function isGreater(left: string, right: string): boolean {
  const leftDetails = getVersionDetails(left);
  const rightDetails = getVersionDetails(right);

  const names: Array<'year' | 'month' | 'day'> = ['year', 'month', 'day']

  for (const name of names) {
    if (leftDetails[name] > rightDetails[name]) {
      return true;
    } else if (leftDetails[name] < rightDetails[name]) {
      return false;
    }
  }


  return false;
}

export function isGreaterOrEqual(left: string, right: string): boolean {
  return isEqual(left, right) || isGreater(left, right);
}

export function isLower(left: string, right: string) {
  return !isGreaterOrEqual(left, right);
}

export function isLowerOrEqual(left: string, right: string): boolean {
  return !isGreater(left, right)
}

const ENGINE1_CUTOFF = '2008-XXX-XX';
const ENGINE3_CUTOFF = '2012-XXX-XX';

export function isEngine1(version: GameVersion): boolean {
  return isLower(version, ENGINE1_CUTOFF)
}

export function isEngine2(version: GameVersion): boolean {
  return isGreaterOrEqual(version, ENGINE1_CUTOFF) && isLower(version, ENGINE3_CUTOFF);
}

export function isEngine3(version:GameVersion): boolean {
  return isGreaterOrEqual(version, '2012-Jan-01');
}

type VersionMap<T> = Array<[GameVersion, T]>

export function findProperInterval<T>(version:GameVersion, map: VersionMap<T>): T {
  if (isLower(version, map[0][0])) {
    return map[0][1]
  }
  for (let i = 0; i < map.length - 1; i++) {
    if (isLower(version, map[i + 1][0])) {
      return map[i][1];
    }
  }

  return map.slice(-1)[0][1];
}

export function inInterval(version: GameVersion, start: GameVersion, end: GameVersion, params?: {
  startOpen?: boolean,
  endOpen?: boolean
}): boolean {
  const startOpen = params?.startOpen ?? false;
  const endOpen = params?.endOpen ?? true;

  if (isLower(version, start)) {
    return false
  }
  if (!startOpen && isEqual(version, start)) {
    return true
  }
  if (isLower(version, end)) {
    return true
  }
  if (!endOpen && isEqual(version, end)) {
    return true
  }
  return false
}