import * as process from 'process';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { readJson } from 'utils/readJson';
import { writeJson } from 'utils/writeJson';
import { getLocalDate } from 'utils/getLocalDate';
import { scheduleRecursiveCall } from 'utils/scheduleRecursiveCall';
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

let getMessageSendTimeoutId: (() => number) | undefined = undefined;

bot.on(message('text'), async (ctx) => {
  const generateMessage = async () => {
    const learnDictionary = await pickLearn();
    const learnEnhancedDictionary = await enhance(learnDictionary);
    const learnMessage = formatLearn(learnEnhancedDictionary);
    const learnImage = await getImage(learnEnhancedDictionary);

    const repeatRecord = pickRepeat();
    const repeatMessage = formatRepeat(repeatRecord);

    const message = [learnMessage, repeatMessage].filter(Boolean).join('\n\n\n');

    ctx.replyWithPhoto(learnImage, { caption: message, parse_mode: 'MarkdownV2' });

    const usedWords = Object.keys(learnDictionary).reduce((acc, word) => ({
      ...acc,
      ...(acc[word] ? {} : { [word]: learnDictionary[word][0].translations[0] }),
    }), {} as Record<string, string>);

    console.log(`Generated a message with words: ${Object.keys(learnDictionary).join(', ')}.`);

    return { message, image: learnImage, usedWords };
  };

  const sendMessage = async (messageParams: SendMessageParams) => {
    const { message, image, usedWords } = messageParams;

    await ctx.telegram.sendPhoto(process.env.TELEGRAM_CHAT_ID || '', image, {
      caption: message,
      parse_mode: 'MarkdownV2',
    });

    const log = readJson('data/log.json');
    const timestamp = getLocalDate();

    log.push({ timestamp: timestamp.toISOString(), words: usedWords });

    writeJson('data/log.json', log);

    console.log(`✅ Message sent at: ${timestamp}.\n`);
  };

  if (ctx.message.text === '/start') {
    console.log('"/start" command received.');
    getMessageSendTimeoutId = await scheduleRecursiveCall<SendMessageParams>(sendMessage, generateMessage, MESSAGE_SEND_TIME);
  }

  if (ctx.message.text === '/stop') {
    console.log('"/stop" command received.');
    if (getMessageSendTimeoutId) {
      clearTimeout(getMessageSendTimeoutId());

      await ctx.reply('The scheduled message has been stopped.');
    } else {
      await ctx.reply('There is no scheduled message to stop.');
    }
  }

  if (ctx.message.text === '/restart') {
    console.log('"/restart" command received.');
    if (getMessageSendTimeoutId) {
      clearTimeout(getMessageSendTimeoutId());

      getMessageSendTimeoutId = await scheduleRecursiveCall<SendMessageParams>(sendMessage, generateMessage, MESSAGE_SEND_TIME);
    } else {
      await ctx.reply('There is no message to regenerate.');
    }
  }
});

bot.launch();
