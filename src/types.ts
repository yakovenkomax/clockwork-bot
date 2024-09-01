export enum PartOfSpeech {
  ADJECTIVE = 'adj',
  ADVERB = 'adv',
  ARTICLE = 'art',
  CONJUNCTION = 'conj',
  NOUN = 'n',
  NUMERAL = 'num',
  INTERJECTION = 'interj',
  PREPOSITION = 'prep',
  PRONOUN = 'pron',
  VERB = 'v',
}

enum NounGender {
  MALE = 'm',
  FEMALE = 'f',
  NEUTER = 'n',
  PLURAL = 'pl',
}

export type Log = {
  timestamp: string;
  words: Record<string, string>;
}[];

export type Dictionary = {
  [word: string]: {
    partOfSpeech: PartOfSpeech;
    translations: string[];
    sentenceNL: string;
    sentenceEN: string;
    article?: string;
    gender?: NounGender;
    irregularForms?: string[];
  }[];
}
