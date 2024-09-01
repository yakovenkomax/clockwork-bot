import * as process from 'process';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { readJson } from 'utils/readJson';
import { writeJson } from 'utils/writeJson';
import { scheduleDailyCall } from 'utils/scheduleDailyCall';
import { pick as pickLearn } from 'learn/pick';
import { pick as pickRepeat } from 'repeat/pick';
import { enhance } from 'learn/enhance';
import { format as formatLearn } from 'learn/format';
import { format as formatRepeat } from 'repeat/format';
import { getImage } from 'learn/getImage';
import { SendMessageParams } from 'types';

const MESSAGE_SEND_TIME = process.env.MESSAGE_SEND_TIME || '';

try {
  readJson('data/log.json');
} catch (e) {
  writeJson('data/log.json', []);
}

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '');

bot.on(message('text'), async (ctx) => {
  let getMessageSendTimeoutId: (() => number) | undefined = undefined;

  const generateMessage = async () => {
    const learnDictionary = await pickLearn();
    const learnEnhancedDictionary = await enhance(learnDictionary);
    const learnMessage = formatLearn(learnEnhancedDictionary);
    const learnImage = await getImage(learnEnhancedDictionary);

    const repeatRecord = await pickRepeat();
    const repeatMessage = formatRepeat(repeatRecord);

    const message = [learnMessage, repeatMessage].filter(Boolean).join('\n\n\n');

    ctx.replyWithPhoto(learnImage, { caption: message, parse_mode: 'MarkdownV2' });

    const usedWords = Object.keys(learnDictionary).reduce((acc, word) => ({
      ...acc,
      ...(acc[word] ? {} : { [word]: learnDictionary[word][0].translations[0] }),
    }), {} as Record<string, string>);

    return { message, image: learnImage, usedWords };
  };

  const sendMessage = async (messageParams: SendMessageParams) => {
    const { message, image, usedWords } = messageParams;

    await ctx.telegram.sendPhoto(process.env.TELEGRAM_CHAT_ID || '', image, {
      caption: message,
      parse_mode: 'MarkdownV2',
    });

    const log = readJson('data/log.json');

    log.push({ timestamp: new Date().toISOString(), words: usedWords });

    writeJson('data/log.json', log);
  };

  if (ctx.message.text === '/start') {
    await ctx.reply(`Generating the next message to be dispatched at ${MESSAGE_SEND_TIME}:\n\n`);

    getMessageSendTimeoutId = await scheduleDailyCall<SendMessageParams>(sendMessage, generateMessage, MESSAGE_SEND_TIME);
  }

  if (ctx.message.text === '/stop') {
    if (getMessageSendTimeoutId) {
      clearTimeout(getMessageSendTimeoutId());

      await ctx.reply('The scheduled message has been stopped.');
    } else {
      await ctx.reply('There is no scheduled message to stop.');
    }
  }

  if (ctx.message.text === '/restart') {
    if (getMessageSendTimeoutId) {
      clearTimeout(getMessageSendTimeoutId());

      ctx.reply(`Generating the next message to be dispatched at ${MESSAGE_SEND_TIME}:\n\n`);

      getMessageSendTimeoutId = await scheduleDailyCall<SendMessageParams>(sendMessage, generateMessage, MESSAGE_SEND_TIME);
    } else {
      await ctx.reply('There is no message to regenerate.');
    }
  }
});

bot.launch();
