import { Dictionary, LogEntry } from 'types';

export const createLogEntry = (timestamp: Date, learnDictionary: Dictionary): LogEntry => {
  const usedWords = Object.keys(learnDictionary).reduce((acc, word) => ({
    ...acc,
    ...(acc[word] ? {} : { [word]: learnDictionary[word][0].translations[0] }),
  }), {} as Record<string, string>);

  return {
    timestamp: timestamp.toISOString(),
    words: usedWords,
  };
};
