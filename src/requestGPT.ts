import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/src/resources/chat/completions';
import process from 'process';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const requestGPT = async <T>(messages: ChatCompletionMessageParam[]): Promise<T> => {
  const completion = await openai.chat.completions.create({
    messages,
    model: 'gpt-3.5-turbo',
    response_format: { type: 'json_object' },
  });

  if (!completion.choices[0].message.content) {
    throw new Error('No content in the response');
  }

  return JSON.parse(completion.choices[0].message.content);
};
