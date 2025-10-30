export function formatPartyLabel(name, year, fallback = '') {
  const trimmedName = typeof name === 'string' ? name.trim() : '';
  const trimmedYear = typeof year === 'string' ? year.trim() : String(year ?? '').trim();

  if (trimmedName && trimmedYear) {
    return `${trimmedName} (${trimmedYear})`;
  }

  if (trimmedName) {
    return trimmedName;
  }

  return fallback ? String(fallback).trim() : trimmedYear;
}
