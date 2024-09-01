import { requestGPT } from 'requestGPT';
import { Dictionary, PartOfSpeech } from 'types';

const exampleInput = ['pad', 'kopen', 'kloppen', 'zijn'];
const exampleOutput: Dictionary = {
  'pad': [
    {
      'partOfSpeech': PartOfSpeech.NOUN,
      'translations': ['path', 'way'],
      'article': 'het',
      'sentenceNL': 'Het pad is lang en moeilijk.',
      'sentenceEN': 'The path is long and hard.',
    },
    {
      'partOfSpeech': PartOfSpeech.NOUN,
      'translations': ['toad'],
      'article': 'de',
      'sentenceNL': 'De groene pad springt naar mij.',
      'sentenceEN': 'The green toad jumps to me.',
    },
  ],
  'kopen': [
    {
      'partOfSpeech': PartOfSpeech.VERB,
      'translations': ['to buy', 'to purchase'],
      'irregularForms': ['kocht', 'gekocht'],
      'sentenceNL': 'Ik koop een nieuwe auto.',
      'sentenceEN': 'I am buying a new car.',
    },
  ],
  'kloppen': [
    {
      'partOfSpeech': PartOfSpeech.VERB,
      'translations': ['to knock', 'to beat'],
      'sentenceNL': 'Ik klop op de eerste deur.',
      'sentenceEN': 'I knock on the first door.',
    },
  ],
  'zijn': [
    {
      'partOfSpeech': PartOfSpeech.VERB,
      'translations': ['to be'],
      'irregularForms': ['was', 'geweest'],
      'sentenceNL': 'Zij zijn mijn vrienden.',
      'sentenceEN': 'They are my friends.',
    },
    {
      'partOfSpeech': PartOfSpeech.PRONOUN,
      'translations': ['his'],
      'sentenceNL': 'Zijn huis is heel groot.',
      'sentenceEN': 'His house is very big.',
    },
  ],
};

export const translate = async (words: string[]): Promise<Dictionary> => await requestGPT([
  {
    role: 'user',
    content: `In the following messages I will provide Dutch words.
      Return a JSON object with Dutch to English translations for those words.
      Output JSON should contain an object with the words as keys.
      Each word should contain an array of translation objects.
      Each translation object groups together translations for this word by a part of speech,
      except for nouns that have different meaning depending on used article (de/het).
      Translation objects should contain keys: partOfSpeech, translations, sentenceNL, sentenceEN.
      "partOfSpeech" should contain an part of speech of the word in a form of abbreviation from the following list:
      "adv", "art", "conj", "n", "num", "interj", "prep", "pron", "v".
      "translations" should contain an array of translations as strings sorted descending by frequency of usage.
      "sentenceNL" should contain a short sentence in Dutch containing the word.
      The most common meaning of the word within the current part of speech should be used.
      "sentenceEN" should contain a translation of the "sentenceNL" to English.
      If the word is a noun, translation object should also contain "article" key
      containing the definitive article that is used with it: "de", "het" "de/het".
      If the word is a noun, translation object should also contain "gender" key
      containing the gender of the noun (or plural): "m", "f", "n", "pl".
      If the word is a noun and has different translations depending on the article,
      they should go into separate translations objects.
      If the word is an irregular verb, translation object should also contain "irregularForms" key
      containing an array of two irregular forms of the verb: "simple past singular", "past participle".
      Translation objects should be sorted descending by frequency of usage of the first of the translations in it.
    `,
  },
  {
    role: 'system',
    content: 'Sure, I will return the translations for the words you provide.',
  },
  {
    role: 'user',
    content: exampleInput.join(', '),
  },
  {
    role: 'system',
    content: JSON.stringify(exampleOutput, null, 2),
  },
  {
    role: 'user',
    content: words.join(', '),
  },
]);
