import { requestImage } from 'openaiApi';
import { Dictionary } from 'types';

const weekdayStyleMap = {
  Monday: 'Photorealistic',
  Tuesday: 'Watercolor',
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
  const description = entryFirstSentences.join(' ');

  const mainPart = `Create a square image in "${styleOfTheDay}" style described by these sentences: ${description}.`;
  const whiteEdgePart = 'The the image must have a thin white edge around it.';
  const noCrowdsPart = 'The image should not contain any crowds of people unless they are needed to show the described scene.';
  const noCroppingPart = 'The contents of the image must fit in the square without cropping.';

  const prompt = [mainPart, whiteEdgePart, noCrowdsPart, noCroppingPart].join('');

  return requestImage(prompt);
};
