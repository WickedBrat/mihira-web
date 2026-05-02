const INDEPENDENT_VOWELS: Record<string, string> = {
  ai: 'ऐ',
  au: 'औ',
  aa: 'आ',
  ii: 'ई',
  uu: 'ऊ',
  a: 'अ',
  i: 'इ',
  u: 'उ',
  e: 'ए',
  o: 'ओ',
};

const VOWEL_SIGNS: Record<string, string> = {
  ai: 'ै',
  au: 'ौ',
  aa: 'ा',
  ii: 'ी',
  uu: 'ू',
  a: '',
  i: 'ि',
  u: 'ु',
  e: 'े',
  o: 'ो',
};

const CONSONANTS: Array<[string, string]> = [
  ['ksh', 'क्ष'],
  ['jn', 'ज्ञ'],
  ['shr', 'श्र'],
  ['chh', 'छ'],
  ['kh', 'ख'],
  ['gh', 'घ'],
  ['ch', 'छ'],
  ['jh', 'झ'],
  ['th', 'थ'],
  ['dh', 'ध'],
  ['ph', 'फ'],
  ['bh', 'भ'],
  ['sh', 'श'],
  ['ks', 'क्ष'],
  ['k', 'क'],
  ['g', 'ग'],
  ['c', 'च'],
  ['j', 'ज'],
  ['t', 'त'],
  ['d', 'द'],
  ['n', 'न'],
  ['p', 'प'],
  ['b', 'ब'],
  ['m', 'म'],
  ['y', 'य'],
  ['r', 'र'],
  ['l', 'ल'],
  ['v', 'व'],
  ['w', 'व'],
  ['s', 'स'],
  ['h', 'ह'],
];

const VOWELS = Object.keys(INDEPENDENT_VOWELS).sort((a, b) => b.length - a.length);

function matchLongest(input: string, index: number, options: string[]) {
  return options.find((option) => input.startsWith(option, index)) ?? null;
}

export function containsDevanagari(value: string | undefined | null) {
  return Boolean(value && /[\u0900-\u097F]/.test(value));
}

export function transliterateToDevanagari(value: string | undefined | null) {
  if (!value) return '';
  if (containsDevanagari(value)) return value;

  const input = value.toLowerCase();
  let output = '';
  let index = 0;
  let pendingConsonant: string | null = null;

  const flushPending = (boundaryChar?: string) => {
    if (!pendingConsonant) return;
    if (pendingConsonant === 'ह') {
      output = output.slice(0, -1) + 'ः';
    } else if (boundaryChar !== undefined) {
      output += '्';
    }
    pendingConsonant = null;
  };

  while (index < input.length) {
    const char = input[index];

    if (/\s/.test(char)) {
      flushPending(' ');
      output += char;
      index += 1;
      continue;
    }

    if (/[-,.;:!?()[\]'"“”]/.test(char)) {
      flushPending(char);
      output += char;
      index += 1;
      continue;
    }

    const vowel = matchLongest(input, index, VOWELS);
    if (vowel) {
      if (pendingConsonant) {
        output += VOWEL_SIGNS[vowel];
        pendingConsonant = null;
      } else {
        output += INDEPENDENT_VOWELS[vowel];
      }
      index += vowel.length;
      continue;
    }

    const consonant = CONSONANTS.find(([latin]) => input.startsWith(latin, index));
    if (consonant) {
      if (pendingConsonant) {
        output += '्';
      }
      output += consonant[1];
      pendingConsonant = consonant[1];
      index += consonant[0].length;
      continue;
    }

    flushPending(char);
    output += char;
    index += 1;
  }

  flushPending(' ');

  return output.replace(/\s+/g, ' ').trim();
}

export function getSanskritDisplayText(originalText?: string, transliteration?: string) {
  const sourceText = transliteration || originalText;
  if (!sourceText) {
    return { devanagari: '', transliteration: '' };
  }

  return {
    devanagari: containsDevanagari(sourceText) ? sourceText : transliterateToDevanagari(sourceText),
    transliteration: containsDevanagari(sourceText) ? (transliteration ?? '') : sourceText,
  };
}
