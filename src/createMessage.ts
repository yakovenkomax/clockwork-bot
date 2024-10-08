import { pick as pickLearn } from 'learn/pick';
import { enhance } from 'learn/enhance';
import { format as formatLearn } from 'learn/format';
import { getImage } from 'learn/getImage';
import { pick as pickRepeat } from 'repeat/pick';
import { format as formatRepeat } from 'repeat/format';
import { MessageData } from 'types';

export const createMessage = async (): Promise<MessageData> => {
  const learnBaseDictionary = pickLearn();
  const learnDictionary = await enhance(learnBaseDictionary);
  const learnMessage = formatLearn(learnDictionary);

  const repeatRecord = pickRepeat();
  const repeatMessage = formatRepeat(repeatRecord);

  const image = await getImage(learnDictionary);

  const message = [learnMessage, repeatMessage].filter(Boolean).join('\n\n\n');

  return {
    learnDictionary,
    repeatRecord,
    message,
    image,
  };
};
