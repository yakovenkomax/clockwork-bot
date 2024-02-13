import { History, Translations } from './types/files.type';
import { readJson } from './utils/readJson';

const PICKED_WORDS_COUNT = 4;
const HISTORY_ENTRIES_BLACKLIST = 2;

export const pickTranslations = (translations: Translations) => {
  let history: History;

  try {
    history = readJson('data/history.json');
  } catch (e) {
    history = [];
  }

  const allWords = Object.keys(translations);
  const wordBlacklist = history.slice(-HISTORY_ENTRIES_BLACKLIST).map((entry) => entry.words).flat();
  const wordsWhiteList = allWords.filter((word) => !wordBlacklist.includes(word));
  const randomWords = wordsWhiteList.sort(() => Math.random() - 0.5).slice(0, PICKED_WORDS_COUNT);
  const pickedTranslations = randomWords.reduce((acc, word) => {
    acc[word] = translations[word];

    return acc
  }, {} as Translations);

  return pickedTranslations;
}
