export const RECORD_STATUS_OPTIONS = [
  { key: 'incomplete', color: '#f87171', labelKey: 'status.incomplete' },
  { key: 'inProgress', color: '#fb923c', labelKey: 'status.inProgress' },
  { key: 'completed', color: '#22c55e', labelKey: 'status.completed' },
];

const STATUS_KEYWORDS = [
  { key: 'incomplete', tokens: ['incom'] },
  { key: 'completed', tokens: ['complet'] },
  { key: 'inProgress', tokens: ['progress', 'proceso'] },
];

export function resolveRecordStatusKey(statusValue) {
  if (!statusValue) {
    return null;
  }

  const normalized = String(statusValue).toLowerCase();
  for (const entry of STATUS_KEYWORDS) {
    if (entry.tokens.some((token) => normalized.includes(token))) {
      return entry.key;
    }
  }

  return null;
}

export function resolveRecordStatusOption(statusValue) {
  const key = resolveRecordStatusKey(statusValue);
  if (!key) {
    return null;
  }

  const option = RECORD_STATUS_OPTIONS.find((entry) => entry.key === key);
  if (!option) {
    return null;
  }

  return option;
}
