export const PT_LOCALIZATION = new Map([
  ['UNLOGGED', 'Deslogado'],
  ['WADDLING', 'Pinguinando'],
  ['WADDLING_AT', 'Pinguinando em'],
  ['TALKING_WITH', 'Falando com o'],
  ['PLAYING', 'Jogando'],
  ['VISITING_IGLOO', 'Visitando um'],
]);

export const getPtLocalizedString = (stringKey: string) => {
  return PT_LOCALIZATION.get(stringKey);
};