export type SendMessageParams = { message: string; image: string, usedWords: Record<string, string> };

export type Log = {
  timestamp: string;
  words: Record<string, string>;
}[];

export type Dictionary = {
  [word: string]: {
    partOfSpeech: string;
    translations: string[];
    irregularForms?: string[];
    article?: string;
    sentenceNL?: string;
    sentenceEN?: string;
  }[];
};
