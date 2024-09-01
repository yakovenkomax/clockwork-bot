import { Dictionary } from 'types';
import { escape } from '../utils/escape';

const getGoogleTranslateLink = (word: string) => `[${word}](${escape(`https://translate.google.com/?sl=nl&tl=en&op=translate&text=${word}`)})`;

export const format = (dictionary: Dictionary) => {
  return dictionary.map(entry => {
    const {
      word,
      translations,
      article,
      gender,
      sentenceNL,
      sentenceEN,
      irregularForms,
    } = entry;
    const wordString = `*${getGoogleTranslateLink(word)}*`;
    const nonNeuterGender = gender !== 'n' ? gender : undefined;
    const articleGenderSting = article && escape(`_(${[article, nonNeuterGender].filter(Boolean).join(', ')})_`);
    const translationsString = `– ${translations.join(', ')}`;

    const mainLine = [wordString, articleGenderSting, translationsString].filter(Boolean).join(' ');
    const irregularFormsLine = irregularForms && escape(`  ${word} / ${irregularForms?.join(' / ')}`);
    const sentenceNLLine = escape(`\n  ${sentenceNL}`);
    const sentenceENLine = escape(`  ${sentenceEN}`);

    return [
      mainLine,
      irregularFormsLine,
      sentenceNLLine,
      sentenceENLine,
    ].filter(Boolean).join('\n');
  }).join('\n\n');
};
