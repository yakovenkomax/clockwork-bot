export type Log = LogEntry[];

export type LogEntry = {
  timestamp: string;
  words: Record<string, string>;
}

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

export type MessageData = {
  learnDictionary: Dictionary;
  repeatRecord?: Record<string, string>;
  message: string;
  image: string;
};
