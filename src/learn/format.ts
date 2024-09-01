import { Dictionary } from 'types';
import { escape } from '../utils/escape';

const getWoordenlijstLink = (word: string) => `[${word}](${escape('https://www.woordenlijst.org/zoeken/?q=')}${encodeURI(word)})`;

export const format = (dictionary: Dictionary) => {
  return Object.keys(dictionary).map(word => {
    const articleString = dictionary[word][0].article ? `(${dictionary[word][0].article}) ` : '';
    const irregularFormsString = dictionary[word][0].irregularForms ? ` / ${dictionary[word][0].irregularForms?.join(' / ')}` : '';
    const mainLine = `${escape(articleString)}*${getWoordenlijstLink(word)}*${escape(irregularFormsString)}`;
    const translationLines = dictionary[word].map(translation => {
      const { partOfSpeech, article, gender, translations } = translation;
      const genderString = gender && gender !== 'n' ? `(${gender})` : '';

      return `  _${partOfSpeech}.${genderString}:_  ${translations.join(', ')}`;
    });
    const exampleNL = `\n  ${dictionary[word][0].sentenceNL}`;
    const exampleEN = `  ${dictionary[word][0].sentenceEN}`;

    return [
      mainLine,
      ...translationLines.map(escape),
      escape(exampleNL),
      escape(exampleEN),
    ].join('\n');
  }).join('\n\n');
};
