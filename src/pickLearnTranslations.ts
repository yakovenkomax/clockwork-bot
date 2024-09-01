import { History, Dictionary } from 'types/files.type';
import { shuffle } from 'utils/shuffle';

const PICKED_WORDS_COUNT = 3;
const HISTORY_ENTRIES_BLACKLIST = 2;

export const pickLearnTranslations = (translations: Dictionary, history: History) => {
  const allWords = Object.keys(translations);
  const wordBlacklist = history.slice(-HISTORY_ENTRIES_BLACKLIST).map((entry) => entry.words).flat();
  const wordsWhiteList = allWords.filter((word) => !wordBlacklist.includes(word));
  const randomWords = shuffle(wordsWhiteList).slice(0, PICKED_WORDS_COUNT);
  const learnTranslations = randomWords.reduce((acc, word) => {
    acc[word] = translations[word];

    return acc;
  }, {} as Dictionary);

  return learnTranslations;
};
