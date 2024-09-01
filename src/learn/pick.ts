import { Log } from 'types';
import { requestChat } from 'openaiApi';

const WORDS_COUNT = 3;
const LOG_ENTRIES_BLACKLIST = 120;

const exampleOutput = {
  'words': ['huis', 'zeggen', 'kind'],
};

export const pick = async (log: Log) => {
  const wordBlacklist = log.slice(-LOG_ENTRIES_BLACKLIST).map((entry) => Object.keys(entry.words)).flat();
  const response = await requestChat<{ words: string[] }>([
    {
      role: 'user',
      content: `Return a JSON containing a single key "words"
        with an array of random ${WORDS_COUNT} words from the 3000 most common used Dutch words,
        do not use the following words: ${wordBlacklist.join(', ')}.
      `,
    },
    {
      role: 'system',
      content: JSON.stringify(exampleOutput, null, 2),
    },
    {
      role: 'user',
      content: 'Return next batch of words.',
    },
  ]);

  return response?.words;
};
