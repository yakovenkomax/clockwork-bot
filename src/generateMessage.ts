import { pick as pickLearn } from 'learn/pick';
import { enhance } from 'learn/enhance';
import { format as formatLearn } from 'learn/format';
import { getImage } from 'learn/getImage';
import { pick as pickRepeat } from 'repeat/pick';
import { format as formatRepeat } from 'repeat/format';

export const generateMessage = async () => {
  const learnDictionary = await pickLearn();
  const learnEnhancedDictionary = await enhance(learnDictionary);
  const learnMessage = formatLearn(learnEnhancedDictionary);
  const learnImage = await getImage(learnEnhancedDictionary);

  const repeatRecord = pickRepeat();
  const repeatMessage = formatRepeat(repeatRecord);

  const message = [learnMessage, repeatMessage].filter(Boolean).join('\n\n\n');

  const usedWords = Object.keys(learnDictionary).reduce((acc, word) => ({
    ...acc,
    ...(acc[word] ? {} : { [word]: learnDictionary[word][0].translations[0] }),
  }), {} as Record<string, string>);

  return { message, image: learnImage, usedWords };
};
