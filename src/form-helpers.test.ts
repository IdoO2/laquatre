import { describe, expect, it } from 'vitest';

import { sanitiseInput } from './form-helpers';

describe('The string input sanitiser', () => {
  it('returns early if empty value', () => {
    expect(sanitiseInput('')).toBe('');
    expect(sanitiseInput(undefined)).toBe('');
    expect(sanitiseInput(0 as unknown as string)).toBe('');
  });

  it('returns early if input is not a string', () => {
    expect(sanitiseInput({} as unknown as string)).toBe('');
  });

  it('removes extraneous whitespace', () => {
    expect(sanitiseInput(' no space ')).toBe('no space');
  });

  it('transforms to lowercase', () => {
    expect(sanitiseInput('Capitalised Throughout')).toBe(
      'capitalised throughout',
    );
  });

  describe('removes disacritics and special characters', () => {
    const withAndWithoutDiacritics = {
      // Leave numbers untouched
      '2023': '2023',
      // February
      février: 'fevrier',
      únor: 'unor',
      // March
      março: 'marco',
      märz: 'marz',
      březen: 'brezen',
      // May
      květen: 'kveten',
      // August
      août: 'aout',
      // June
      červen: 'cerven',
      // September
      září: 'zari',
      // Unfortunately
      œuf: 'uf',
      // XKCD Little Bobby Tables
      "Robert'); DROP TABLE Students; --": 'robert drop table students',
    };

    it('converts all expected lowercase strings to readable ascii', () => {
      const input = Object.keys(withAndWithoutDiacritics);
      const output = Object.values(withAndWithoutDiacritics);
      expect(input.map(sanitiseInput)).toEqual(output);
    });
  });
});
