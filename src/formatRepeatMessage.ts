import { Translations } from 'types/files.type';

const SPOILER_LENGTH = 18;
const PAD_STRING = '・';
const PAD_TO_REGULAR_CHAR_RATIO = 1.9;

const padToLength = (word: string, length: number) => {
  const charsNeeded = Math.max(length - word.length, 0);
  const padWidth = Math.floor(charsNeeded / PAD_TO_REGULAR_CHAR_RATIO);
  const extraSymbols = PAD_STRING.repeat(padWidth);

  return `${word}${extraSymbols}`;
}

const getRepeatLine = (word: string, mainTranslation: string) => {
  return `*${mainTranslation}* – ||${padToLength(word, SPOILER_LENGTH)}||`;
};

export const formatRepeatMessage = (translations: Translations) => {
  const repeatLines = Object.keys(translations).map(word => getRepeatLine(word, translations[word].main));

  return repeatLines.join('\n\n');
}
