import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/src/resources/chat/completions';
import process from 'process';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const requestChat = async <T>(messages: ChatCompletionMessageParam[]): Promise<T> => {
  const completion = await openai.chat.completions.create({
    messages,
    model: 'gpt-3.5-turbo',
    response_format: { type: 'json_object' },
  });

  if (!completion.choices[0].message.content) {
    throw new Error('No content in the response from requestChat');
  }

  return JSON.parse(completion.choices[0].message.content);
};

export const requestImage = async (prompt: string) => {
  const image = await openai.images.generate({ prompt, model: 'dall-e-3' });

  if (!image.data[0].url) {
    throw new Error('No content in the response from requestImage');
  }

  return image.data[0].url;
};
