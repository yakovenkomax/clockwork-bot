import { History, Dictionary } from 'types/files.type';
import { shuffle } from 'utils/shuffle';

const REPEAT_FROM_DAYS_BEFORE = 2;

export const pickRepeatTranslations = (translations: Dictionary, history: History) => {
  const wordsToRepeat = history?.[history.length - REPEAT_FROM_DAYS_BEFORE]?.words || [];
  const shuffledWords = shuffle(wordsToRepeat);
  const repeatTranslations = shuffledWords.reduce((acc, word) => {
    acc[word] = translations[word];

    return acc;
  }, {} as Dictionary);

  return repeatTranslations;
};
