import { readJson } from 'utils/readJson';
import { Dictionary, Log } from 'types';

const WORDS_COUNT = 3;
const LOG_ENTRIES_BLACKLIST = 120;

export const pickLearn = () => {
  const log: Log = readJson('data/log.json');
  const dictionary: Dictionary = readJson('data/dictionary.json');
  const wordBlacklist = log.slice(-LOG_ENTRIES_BLACKLIST).map((entry) => Object.keys(entry.words)).flat();
  const wordsWhiteList = Object.keys(dictionary).filter((word) => !wordBlacklist.includes(word));
  const pickedWords = wordsWhiteList.sort(() => 0.5 - Math.random()).slice(0, WORDS_COUNT);
  const pickedDictionary = pickedWords.reduce((acc, word) => ({ ...acc, [word]: dictionary[word] }), {} as Dictionary);

  return pickedDictionary;
};
