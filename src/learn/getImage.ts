import { requestImage } from 'openaiApi';

const weekdayStyleMap = {
  Monday: 'Photorealistic',
  Tuesday: 'Impressionism',
  Wednesday: 'Contemporary',
  Thursday: 'Expressionism',
  Friday: 'Art Nouveau',
  Saturday: 'Ukiyo-e',
  Sunday: 'Cartoon/Comic',
};

export const getImage = async (description: string) => {
  const weekDay = new Date().toLocaleString('en-US', { weekday: 'long' }) as keyof typeof weekdayStyleMap;
  const styleOfTheDay = weekdayStyleMap[weekDay];

  const prompt = `Create a square image in "${styleOfTheDay}" style, divided into three equal sections. Each section is described by these sentences: ${description}. The image must have a white border around the entire canvas. The image and the border must fit within the square canvas without cropping.`;

  return requestImage(prompt);
};
