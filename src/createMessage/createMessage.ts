import { pickLearn } from './pickLearn';
import { enhance } from './enhance';
import { getImage } from './getImage';
import { pickRepeat } from './pickRepeat';
import { MessageData } from 'types';

export const createMessage = async (): Promise<MessageData> => {
  const learnBaseDictionary = pickLearn();
  const learnDictionary = await enhance(learnBaseDictionary);
  const repeatRecord = pickRepeat();
  const image = await getImage(learnDictionary);

  return {
    learnDictionary,
    repeatRecord,
    image,
  };
};
