/** A string that follows a pattern YYY-MMM-DD, with months being the initials of each month with capital letter for a start */
export type Version = string;

/** Returns undefined if an invalid version, otherwise an array [year, month, day] */
export function processVersion(version: string): [number, number, number] {
  const dateMatch = version.match(/(\d{4})\-(\d{2}|##)-(\d{2}|##)/);
  if (dateMatch === null) {
    throw new Error(`Invalid version: ${version}`);
  }

  const year = Number(dateMatch[1]);
  const month = dateMatch[2] == '##' ? 1 : Number(dateMatch[2]);
  const day = dateMatch[3] == '##' ? 1 : Number(dateMatch[3]);

  if (year < 2005 || year > 2017) {
    throw new Error(`Year out of range: ${year}`);
  }

  const date = new Date(year, month - 1, day);
  if (isNaN(date.getTime())) {
    throw new Error(`Version is not a real date: ${version}`);
  }

  return [year, month, day];
}

/** Get object with year, month and day of the version */
function getVersionDetails(version: string): {
  year: number,
  month: number,
  day: number
} {
  const decomposed = processVersion(version);

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

export function isEqual(left: string, right: string): boolean {
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

const ENGINE1_CUTOFF = '2008-##-##';
const ENGINE3_CUTOFF = '2012-##-##';

export function isEngine1(version: Version): boolean {
  return isLower(version, ENGINE1_CUTOFF)
}

export function isEngine2(version: Version): boolean {
  return isGreaterOrEqual(version, ENGINE1_CUTOFF) && isLower(version, ENGINE3_CUTOFF);
}

export function isEngine3(version: Version): boolean {
  return isGreaterOrEqual(version, ENGINE3_CUTOFF);
}

export function inInterval(version: Version, start: Version, end: Version, params?: {
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