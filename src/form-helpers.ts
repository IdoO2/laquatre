function normaliseString(input: string) {
  return input.trim().toLocaleLowerCase();
}

function asciiseDiacritics(input: string) {
  // 1. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
  // 2. https://en.wikipedia.org/wiki/Combining_Diacritical_Marks
  // 3. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Unicode_Property_Escapes
  return input.normalize('NFKD').replace(/\p{Diacritic}/gu, '');
}

function removeNonAlphaNumeric(input: string) {
  return input
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .replace(/\s+/, ' ')
    .trim();
}

export function sanitiseInput(input?: string) {
  if (!input) return '';

  // Should be prevented by TS, but errare humanum etc.
  if (typeof input !== 'string') return '';

  return removeNonAlphaNumeric(asciiseDiacritics(normaliseString(input)));
}
