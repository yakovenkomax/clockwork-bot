import { Frequency, PartOfSpeech } from 'types/enums.type';

export type History = Array<{
  date: string;
  words: Array<string>;
}>;

export type TranslationsByFrequency = {
  [key in Frequency]?: Array<string>;
}

export type TranslationsByPartOfSpeech = {
  [key in PartOfSpeech]?: TranslationsByFrequency;
}

export type Translation = {
  main: string;
  partsOfSpeech?: TranslationsByPartOfSpeech;
};

export type Dictionary = {
  [word: string]: Translation;
}
