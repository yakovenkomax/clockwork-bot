import { requestChat } from 'utils/openAI';
import { Dictionary } from 'types';

const exampleInput: Dictionary = {
  pad: [{
    'partOfSpeech': 'noun',
    'article': 'het',
    'translations': ['path'],
  }, {
    'partOfSpeech': 'noun',
    'translations': ['toad'],
    'article': 'de',
  }],
  kopen: [{
    'partOfSpeech': 'verb',
    'translations': ['to buy', 'to purchase'],
  }],
  werken: [{
    'partOfSpeech': 'verb',
    'translations': ['to work'],
  }],
  zijn: [{
    'partOfSpeech': 'verb',
    'translations': ['to be'],
  }, {
    'partOfSpeech': 'pron',
    'translations': ['his'],
  }],
};

const exampleOutput: Dictionary = {
  pad: [{
    'partOfSpeech': 'noun',
    'article': 'het',
    'translations': ['path', 'way'],
    'sentenceNL': 'Het pad is lang en moeilijk.',
    'sentenceEN': 'The path is long and hard.',
  }, {
    'partOfSpeech': 'noun',
    'translations': ['toad'],
    'article': 'de',
    'sentenceNL': 'De groene pad springt naar mij.',
    'sentenceEN': 'The green toad jumps to me.',
  }],
  kopen: [{
    'partOfSpeech': 'verb',
    'translations': ['to buy', 'to purchase'],
    'irregularForms': ['kocht', 'gekocht'],
    'sentenceNL': 'Ik koop een nieuwe auto.',
    'sentenceEN': 'I am buying a new car.',
  }],
  werken: [{
    'partOfSpeech': 'verb',
    'translations': ['to work'],
    'sentenceNL': 'Ik werk in een restaurant.',
    'sentenceEN': 'I work in a restaurant.',
  }],
  zijn: [{
    'partOfSpeech': 'verb',
    'translations': ['to be'],
    'irregularForms': ['was', 'geweest'],
    'sentenceNL': 'Zij zijn mijn vrienden.',
    'sentenceEN': 'They are my friends.',
  }, {
    'partOfSpeech': 'pron',
    'translations': ['his'],
    'sentenceNL': 'Zijn huis is heel groot.',
    'sentenceEN': 'His house is very big.',
  }],
};

export const enhance = async (dictionary: Dictionary) => {
  const response = await requestChat<Dictionary>([
    {
      role: 'user',
      content: `I am creating a Dutch to English dictionary.
        
        I will provide a JSON object. Each key is a Dutch word, and the value is an array of translation objects.
        
        Return a JSON object with the same structure, but enhance the translation objects with the following information:
        
        Check the "partOfSpeech" property of the translation object.
        If the current word in this part of speech has other translations that are not listed in "translations" property, add them to the array.

        If the translation is a "verb" that has irregular "simple past singular" and "past participle" forms, add the "verbForms" property
        with an array with "simple past singular" and "past participle" verb forms.
        
        The structure of each translation object should be:
        
        {
          partOfSpeech: string;
          translations: string[]; // Array of English translations for this part of speech
          irregularForms?: string[]; // Irregular verb forms (for irregular verbs only)
          article?: string; // Definitive Dutch article used with this word (for nouns only)
          sentenceNL: string;
          sentenceEN: string;
        }
        
        Input:
        
        ${JSON.stringify(exampleInput, null, 2)}
      `,
    },
    {
      role: 'system',
      content: JSON.stringify(exampleOutput, null, 2),
    },
    {
      role: 'user',
      content: JSON.stringify(dictionary, null, 2),
    },
  ]);

  return response;
};
