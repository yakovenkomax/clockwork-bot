import { requestImage } from 'openaiApi';
import { Dictionary } from 'types';

const weekdayStyleMap = {
  Monday: 'Cubism',
  Tuesday: 'Expressionism',
  Wednesday: 'Contemporary',
  Thursday: 'Impressionism',
  Friday: 'Surrealism',
  Saturday: 'Ukiyo-e',
  Sunday: 'Art Nouveau',
};

export const getImage = async (dictionary: Dictionary) => {
  const weekDay = new Date().toLocaleString('en-US', { weekday: 'long' }) as keyof typeof weekdayStyleMap;
  const styleOfTheDay = weekdayStyleMap[weekDay];
  const prompt = `A painting in ${styleOfTheDay} style featuring these scenarios in one picture: ${dictionary.map(entry => entry.sentenceEN).join(', ')}`;

  return requestImage(prompt);
};
