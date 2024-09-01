import * as process from 'process';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { readJson } from 'utils/readJson';
import { writeJson } from 'utils/writeJson';
import { scheduleDailyCall } from 'utils/scheduleDailyCall';
import { pick as pickLearn } from 'learn/pick';
import { pick as pickRepeat } from 'repeat/pick';
import { translate } from 'learn/translate';
import { format as formatLearn } from 'learn/format';
import { format as formatRepeat } from 'repeat/format';
import { getImage } from 'learn/getImage';
import { Log } from 'types';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';
const MESSAGE_SEND_TIME = process.env.MESSAGE_SEND_TIME || '';

let log: Log;

try {
  log = readJson('data/log.json');
} catch (e) {
  log = [];
}

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

bot.on(message('text'), async (ctx) => {
  let getMessageSendTimeoutId: (() => number) | undefined = undefined;

  const getMessageParams = async () => {
    const learnWords = log.length > 0 ? await pickLearn(log) : ['ik', 'ben', 'een', 'appel'];
    const learnDictionary = await translate(learnWords);
    const learnMessage = formatLearn(learnDictionary);
    const learnImage = await getImage(learnDictionary);

    const repeatRecord = pickRepeat(log);
    const repeatMessage = formatRepeat(repeatRecord);

    const message = [learnMessage, repeatMessage].filter(Boolean).join('\n\n\n');

    ctx.replyWithPhoto(learnImage, {
      caption: `*Next message to be dispatched at ${MESSAGE_SEND_TIME}:*\n\n${message}`,
      parse_mode: 'MarkdownV2',
    });

    const usedWords = learnDictionary.reduce((acc, entry) => {
      if (acc[entry.word]) {
        return acc;
      }

      acc[entry.word] = entry.translations[0];

      return acc;
    }, {} as Record<string, string>);

    return { message, image: learnImage, usedWords };
  };

  type SendMessageParams = { message: string; image: string, usedWords: Record<string, string> };

  const sendMessage = async (messageParams: SendMessageParams) => {
    const { message, image, usedWords } = messageParams;

    await ctx.telegram.sendPhoto(TELEGRAM_CHAT_ID, image, {
      caption: message,
      parse_mode: 'MarkdownV2',
    });

    log.push({ timestamp: new Date().toISOString(), words: usedWords });

    writeJson('data/log.json', log);
  };

  if (ctx.message.text === '/start') {
    getMessageSendTimeoutId = await scheduleDailyCall<SendMessageParams>(sendMessage, getMessageParams, MESSAGE_SEND_TIME);
  }

  if (ctx.message.text === '/stop') {
    if (getMessageSendTimeoutId) {
      clearTimeout(getMessageSendTimeoutId());

      await ctx.reply('The scheduled message has been stopped.');
    } else {
      await ctx.reply('There is no scheduled message to stop.');
    }
  }
});

bot.launch();
