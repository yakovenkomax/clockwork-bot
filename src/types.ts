export enum NounGender {
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
  word: string;
  translations: string[];
  sentenceNL: string;
  sentenceEN: string;
  article?: string;
  gender?: NounGender;
  irregularForms?: string[];
}[];
