import { Log } from 'types';
import { requestGPT } from 'requestGPT';

const WORDS_COUNT = 3;
const LOG_ENTRIES_BLACKLIST = 20;

const exampleOutput = {
  'words': ['huis', 'zeggen', 'kind'],
};

export const pick = async (log: Log): Promise<string[]> => {
  const wordBlacklist = log.slice(-LOG_ENTRIES_BLACKLIST).map((entry) => Object.keys(entry.words)).flat();
  const response = await requestGPT([
    {
      role: 'user',
      content: `Return a JSON containing a single key "words"
        with an array of random ${WORDS_COUNT} words from the 3000 most common used Dutch words,
        excluding the following words: ${wordBlacklist.join(', ')}.
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

  return response.words;
};
