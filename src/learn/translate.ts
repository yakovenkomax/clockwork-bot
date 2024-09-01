import { requestChat } from 'openaiApi';
import { Dictionary, NounGender } from 'types';

const exampleInput = ['pad', 'kopen', 'werken', 'zijn'];
const exampleOutput: Dictionary = [
  {
    'word': 'pad',
    'translations': ['path', 'way'],
    'article': 'het',
    'sentenceNL': 'Het pad is lang en moeilijk.',
    'sentenceEN': 'The path is long and hard.',
  },
  {
    'word': 'pad',
    'translations': ['toad'],
    'article': 'de',
    'sentenceNL': 'De groene pad springt naar mij.',
    'sentenceEN': 'The green toad jumps to me.',
  },
  {
    'word': 'kopen',
    'translations': ['to buy', 'to purchase'],
    'irregularForms': ['kocht', 'gekocht'],
    'sentenceNL': 'Ik koop een nieuwe auto.',
    'sentenceEN': 'I am buying a new car.',
  },
  {
    'word': 'werken',
    'translations': ['to work'],
    'sentenceNL': 'Ik werk in een restaurant.',
    'sentenceEN': 'I work in a restaurant.',
  },
  {
    'word': 'zijn',
    'translations': ['to be'],
    'irregularForms': ['was', 'geweest'],
    'sentenceNL': 'Zij zijn mijn vrienden.',
    'sentenceEN': 'They are my friends.',
  },
  {
    'word': 'zijn',
    'translations': ['his'],
    'sentenceNL': 'Zijn huis is heel groot.',
    'sentenceEN': 'His house is very big.',
  },
];

export const translate = async (words: string[]) => {
  const genderList = Object.values(NounGender).map(gender => `"${gender}"`);

  const response = await requestChat<{ dictionary: Dictionary }>([
    {
      role: 'user',
      content: `I am creating a Dutch to English vocabulary.
        
        I will provide list of Dutch words. Return a JSON object containing a single property "dictionary" with an array of translation objects.
        
        If the word can be multiple parts of speech, add multiple translation objects with the same word,
        each representing a different part of speech and corresponding translations.
        
        If the word is a noun, the translation object must contain "article" property
        with the definitive Dutch article "het" or "de" used with this word.
        
        If the word is a noun that can be used with both "de" and "het" articles (e.g. "pad"),
        add two objects with this word, each representing the word with a different article and corresponding translations.
        
        If the word is a noun, the translation object must contain "gender" property
        with the shortened gender of the noun: "m" for male, "f" for female, "n" for neuter, or "pl" for plural.
        
        If the word is an verb that has irregular "simple past singular" and "past participle" forms, add the "verbForms" property
        with an array with "simple past singular" and "past participle" verb forms.
        
        The structure of each translation object should be:
        
        {
          word: string; // The Dutch word
          translations: string[]; // Array of English translations for this part of speech
          sentenceNL: string; // Example sentence in Dutch
          sentenceEN: string; // English translation of the example sentence
          verbForms?: string[]; // Irregular verb forms (for irregular verbs only)
          article?: string; // Definitive Dutch article used with this word (for nouns only)
          gender?: string; // Gender of the word: "m" for male, "f" for female, "n" for neuter, or "pl" for plural (for nouns only)
        }
        
        List of Dutch words:
        ${exampleInput.join(', ')}
      `,
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

  return response?.dictionary;
};
