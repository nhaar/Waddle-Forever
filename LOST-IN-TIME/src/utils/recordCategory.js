export const RECORD_CATEGORY = {
  BASE: 'base',
  PARTY: 'party',
};

const PARTY_KEYWORDS = ['party', 'fiest', 'event', 'evento'];

export function normalizeRecordCategory(value) {
  if (typeof value !== 'string') {
    return RECORD_CATEGORY.BASE;
  }

  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return RECORD_CATEGORY.BASE;
  }

  if (PARTY_KEYWORDS.some((keyword) => normalized.startsWith(keyword))) {
    return RECORD_CATEGORY.PARTY;
  }

  return normalized === RECORD_CATEGORY.PARTY ? RECORD_CATEGORY.PARTY : RECORD_CATEGORY.BASE;
}

export function isPartyRecordCategory(value) {
  return normalizeRecordCategory(value) === RECORD_CATEGORY.PARTY;
}

export function getRecordCategoryKey(value) {
  return normalizeRecordCategory(value);
}
