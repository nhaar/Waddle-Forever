const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const ISO_VARIANT_REGEX = /^(\d{4})[\/-](\d{2})[\/-](\d{2})$/;
const DMY_REGEX = /^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})$/;

function pad(value) {
  return String(value).padStart(2, '0');
}

export function toISODate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`;
}

function normalizeYear(yearFragment) {
  let yearString = String(yearFragment);
  if (yearString.length === 4) {
    return yearString;
  }
  if (yearString.length === 3) {
    return yearString.padStart(4, '0');
  }
  const numeric = Number(yearString);
  if (Number.isNaN(numeric)) {
    return null;
  }
  // Assume years with two digits are in the 2000s by default.
  return `20${pad(numeric)}`;
}

export function ensureISODate(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return toISODate(value);
  }

  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (ISO_DATE_REGEX.test(trimmed)) {
    return trimmed;
  }

  const isoVariant = trimmed.match(ISO_VARIANT_REGEX);
  if (isoVariant) {
    return `${isoVariant[1]}-${isoVariant[2]}-${isoVariant[3]}`;
  }

  const dmyMatch = trimmed.match(DMY_REGEX);
  if (dmyMatch) {
    const day = pad(dmyMatch[1]);
    const month = pad(dmyMatch[2]);
    const normalizedYear = normalizeYear(dmyMatch[3]);
    if (!normalizedYear) {
      return null;
    }
    return `${normalizedYear}-${month}-${day}`;
  }

  return null;
}

export function isoToDate(isoString) {
  const normalized = ensureISODate(isoString);
  if (!normalized) {
    return null;
  }

  const [year, month, day] = normalized.split('-').map((part) => Number(part));
  if ([year, month, day].some((part) => Number.isNaN(part))) {
    return null;
  }

  return new Date(year, month - 1, day);
}

export function normalizeRange(range) {
  if (!range) {
    return null;
  }

  const startIso = ensureISODate(range.start ?? range.begin ?? range.from);
  const endIso = ensureISODate(range.end ?? range.finish ?? range.to);

  if (!startIso && !endIso) {
    return null;
  }

  if (!startIso) {
    return { start: endIso, end: endIso };
  }

  if (!endIso) {
    return { start: startIso, end: startIso };
  }

  if (startIso <= endIso) {
    return { start: startIso, end: endIso };
  }

  return { start: endIso, end: startIso };
}

export function serializeDateRanges(ranges) {
  if (!Array.isArray(ranges) || ranges.length === 0) {
    return '';
  }

  const normalized = ranges.map((range) => normalizeRange(range)).filter(Boolean);
  if (normalized.length === 0) {
    return '';
  }

  const sorted = [...normalized].sort((a, b) => {
    if (a.start < b.start) {
      return -1;
    }
    if (a.start > b.start) {
      return 1;
    }
    if (a.end < b.end) {
      return -1;
    }
    if (a.end > b.end) {
      return 1;
    }
    return 0;
  });

  return JSON.stringify(sorted);
}

function extractDatesFromText(text) {
  if (!text) {
    return [];
  }

  const matches = text.match(/(\d{4}-\d{2}-\d{2}|\d{4}[\/-]\d{2}[\/-]\d{2}|\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/g);
  if (!matches) {
    return [];
  }

  return matches
    .map((fragment) => ensureISODate(fragment))
    .filter((fragment) => fragment);
}

export function parseDateRanges(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((range) => normalizeRange(range)).filter(Boolean);
  }

  if (typeof value !== 'string') {
    return [];
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return [];
  }

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.map((range) => normalizeRange(range)).filter(Boolean);
    }
  } catch (error) {
    // Ignore JSON parse errors and fallback to textual parsing.
  }

  const isoFragments = extractDatesFromText(trimmed);
  if (isoFragments.length === 0) {
    return [];
  }

  const ranges = [];
  for (let index = 0; index < isoFragments.length; index += 1) {
    const start = isoFragments[index];
    const next = isoFragments[index + 1];
    if (next) {
      if (start <= next) {
        ranges.push({ start, end: next });
      } else {
        ranges.push({ start: next, end: start });
      }
      index += 1;
    } else {
      ranges.push({ start, end: start });
    }
  }

  return ranges;
}

export function formatDateForDisplay(isoString) {
  const date = isoToDate(isoString);
  if (!date) {
    return '';
  }

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatRangeForDisplay(range) {
  const normalized = normalizeRange(range);
  if (!normalized) {
    return '';
  }

  const startLabel = formatDateForDisplay(normalized.start);
  const endLabel = formatDateForDisplay(normalized.end);
  if (!startLabel && !endLabel) {
    return '';
  }

  if (startLabel === endLabel) {
    return startLabel;
  }

  return `${startLabel} - ${endLabel}`;
}

export function formatDateRangesForDisplay(ranges) {
  if (!Array.isArray(ranges) || ranges.length === 0) {
    return '';
  }

  const labels = ranges
    .map((range) => formatRangeForDisplay(range))
    .filter((label) => label);

  return labels.join('\n');
}

export function formatStoredDateRanges(value) {
  const ranges = parseDateRanges(value);
  return formatDateRangesForDisplay(ranges);
}

export function isDateWithinRange(range, targetDate) {
  const normalizedTarget = ensureISODate(targetDate);
  if (!normalizedTarget) {
    return false;
  }

  const normalizedRange = normalizeRange(range);
  if (!normalizedRange) {
    return false;
  }

  return (
    normalizedRange.start <= normalizedTarget && normalizedTarget <= normalizedRange.end
  );
}

export function isDateWithinRanges(ranges, targetDate) {
  const normalizedTarget = ensureISODate(targetDate);
  if (!normalizedTarget) {
    return false;
  }

  const normalizedRanges = Array.isArray(ranges) ? ranges : parseDateRanges(ranges);
  if (!Array.isArray(normalizedRanges) || normalizedRanges.length === 0) {
    return false;
  }

  return normalizedRanges.some((range) => isDateWithinRange(range, normalizedTarget));
}

export function getTodayISODate() {
  return toISODate(new Date());
}
