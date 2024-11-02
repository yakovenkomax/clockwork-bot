import { requestImage } from 'utils/openAI';
import { Dictionary } from 'types';

const weekdayStyleMap = {
  Monday: 'Watercolor painting',
  Tuesday: 'Poster',
  Wednesday: 'Children\'s book illustration',
  Thursday: 'Art Nouveau',
  Friday: 'Expressionism painting',
  Saturday: 'Ukiyo-e',
  Sunday: 'Cartoon/Comic',
};

export const getImage = async (dictionary: Dictionary) => {
  const weekDay = new Date().toLocaleString('en-US', { weekday: 'long' }) as keyof typeof weekdayStyleMap;
  const styleOfTheDay = weekdayStyleMap[weekDay];
  const entryFirstSentences = Object.keys(dictionary).map(word => dictionary[word][0].sentenceEN);
  const description = entryFirstSentences.join(' ');

  const mainPart = `Create a square image in "${styleOfTheDay}" style described by these sentences: ${description}\n\n`;
  const noCrowdsPart = 'The image should not have crowds of people in it.';
  const noCroppingPart = 'The contents of the image must fit in the square without cropping.';

  const prompt = [mainPart, noCrowdsPart, noCroppingPart].join('');

  return requestImage(prompt);
};
