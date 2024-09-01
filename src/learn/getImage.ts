import { requestImage } from 'openaiApi';
import { Dictionary } from 'types';

const weekdayStyleMap = {
  Monday: 'Photorealistic',
  Tuesday: 'Impressionism',
  Wednesday: 'Contemporary',
  Thursday: 'Expressionism',
  Friday: 'Art Nouveau',
  Saturday: 'Ukiyo-e',
  Sunday: 'Cartoon/Comic',
};

export const getImage = async (dictionary: Dictionary) => {
  const weekDay = new Date().toLocaleString('en-US', { weekday: 'long' }) as keyof typeof weekdayStyleMap;
  const styleOfTheDay = weekdayStyleMap[weekDay];
  const entryFirstSentences = Object.keys(dictionary).map(word => dictionary[word][0].sentenceEN);
  const prompt = `Create a square image in "${styleOfTheDay}" style, divided into three equal sections. Each section is described by these sentences: ${entryFirstSentences.join(', ')}. The image must have a thin white border around the entire canvas.`;

  return requestImage(prompt);
};
