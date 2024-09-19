import { escape } from 'utils/escape';
import { Dictionary } from 'types';

const getGoogleTranslateLink = (word: string) => `[${word}](${escape(`https://translate.google.com/?sl=nl&tl=en&op=translate&text=${word}`)})`;

export const formatLearn = (dictionary: Dictionary) => {
  return Object.keys(dictionary).map((word) => {
    return dictionary[word].map((entry) => {
      const {
        translations,
        article,
        sentenceNL,
        sentenceEN,
        irregularForms,
      } = entry;
      const wordString = `*${getGoogleTranslateLink(word)}*`;
      const articleSting = article && escape(`, _${article}_`);
      const translationsString = escape(` – ${translations.join(', ')}`);

      const mainLine = [wordString, articleSting, translationsString].filter(Boolean).join('');
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
  }).join('\n\n');
};
