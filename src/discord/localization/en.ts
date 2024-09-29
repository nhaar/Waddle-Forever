export const EN_LOCALIZATION = new Map([
  ['UNLOGGED', 'Unlogged'],
  ['WADDLING', 'Waddling'],
  ['WADDLING_AT', 'Waddling at'],
  ['TALKING_WITH', 'Talking with'],
  ['PLAYING', 'Playing'],
  ['VISITING_IGLOO', 'Visiting an'],
]);

export const getEnLocalizedString = (stringKey: string) => {
  return EN_LOCALIZATION.get(stringKey);
};