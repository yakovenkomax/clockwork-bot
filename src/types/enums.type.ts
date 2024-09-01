export enum Frequency {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
}

export enum PartOfSpeech {
  ARTICLE = 'article',
  NOUN = 'noun',
  ABBREVIATION = 'abbreviation',
  VERB = 'verb',
  ADJECTIVE = 'adjective',
  PREPOSITION = 'preposition',
  ADVERB = 'adverb',
  CONJUNCTION = 'conjunction',
  PRONOUN = 'pronoun',
  AUXILIARY_VERB = 'auxiliary verb',
  INTERJECTION = 'interjection'
}

export const FrequencyWeight = {
  [Frequency.COMMON]: 3,
  [Frequency.UNCOMMON]: 2,
  [Frequency.RARE]: 1,
};

export const PartOfSpeechAbbreviation = {
  [PartOfSpeech.NOUN]: 'n',
  [PartOfSpeech.VERB]: 'v',
  [PartOfSpeech.ADJECTIVE]: 'adj',
  [PartOfSpeech.ADVERB]: 'adv',
  [PartOfSpeech.PREPOSITION]: 'prep',
  [PartOfSpeech.CONJUNCTION]: 'conj',
  [PartOfSpeech.PRONOUN]: 'pron',
  [PartOfSpeech.ARTICLE]: 'art',
  [PartOfSpeech.AUXILIARY_VERB]: 'aux',
  [PartOfSpeech.ABBREVIATION]: 'abbr',
  [PartOfSpeech.INTERJECTION]: 'interj',
};
