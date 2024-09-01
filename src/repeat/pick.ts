import { shuffle } from 'utils/shuffle';
import { Log } from 'types';

const REPEAT_FROM_DAYS_BEFORE = 2;

export const pick = (log: Log) => {
  const logEntry = log?.[log.length - REPEAT_FROM_DAYS_BEFORE];

  if (!logEntry) {
    return undefined;
  }

  const wordsToRepeat = Object.keys(logEntry.words);
  const shuffledWords = shuffle(wordsToRepeat);

  return shuffledWords.reduce((acc, word) => {
    acc[word] = logEntry.words[word];

    return acc;
  }, {} as Record<string, string>);
};
