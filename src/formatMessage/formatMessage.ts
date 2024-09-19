import { formatLearn } from './formatLearn';
import { formatRepeat } from './formatRepeat';
import { MessageData } from 'types';

export const formatMessage = (messageData: MessageData) => {
  const { learnDictionary, repeatRecord } = messageData;
  const learnMessage = formatLearn(learnDictionary);
  const repeatMessage = formatRepeat(repeatRecord);

  const message = [learnMessage, repeatMessage].filter(Boolean).join('\n\n\n');

  return message;
};
