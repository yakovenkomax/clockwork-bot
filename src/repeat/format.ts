import { escape } from 'utils/escape';

const SPOILER_LENGTH = 18;
const PAD_STRING = '・';
const PAD_TO_REGULAR_CHAR_RATIO = 1.9;

const padToLength = (word: string, length: number) => {
  const charsNeeded = Math.max(length - word.length, 0);
  const padWidth = Math.floor(charsNeeded / PAD_TO_REGULAR_CHAR_RATIO);
  const extraSymbols = PAD_STRING.repeat(padWidth);

  return `${word}${extraSymbols}`;
};

export const format = (dictionary?: Record<string, string>) => {
  if (!dictionary) {
    return undefined;
  }

  const repeatLines = Object.keys(dictionary).map(word => {
    return `*${dictionary[word]}* – ||${padToLength(word, SPOILER_LENGTH)}||`;
  }).join('\n\n');

  return escape(repeatLines);
};
