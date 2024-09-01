import * as process from 'process';
import { Telegraf } from 'telegraf';
import { readJson } from 'utils/readJson';
import { writeJson } from 'utils/writeJson';
import { escape } from 'utils/escape';
import { message } from 'telegraf/filters';
import { scheduleDailyCall } from 'scheduleDailyCall';
import { pickLearnTranslations } from 'pickLearnTranslations';
import { formatLearnMessage } from 'formatLearnMessage';
import { pickRepeatTranslations } from 'pickRepeatTranslations';
import { formatRepeatMessage } from 'formatRepeatMessage';
import { History, Dictionary } from 'types/files.type';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';
const MESSAGE_SEND_TIME = '09:00';

let history: History;
const translations: Dictionary = readJson('data/translations.json');

try {
  history = readJson('data/history.json');
} catch (e) {
  history = [];
}

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

bot.on(message('text'), async (ctx) => {
  let getMessageSendTimeoutId: (() => number) | undefined = undefined;

  const getMessageParams = () => {
    const learnTranslations = pickLearnTranslations(translations, history);
    const learnMessage = formatLearnMessage(learnTranslations);
    const repeatTranslations = pickRepeatTranslations(translations, history);
    const repeatMessage = formatRepeatMessage(repeatTranslations);
    const usedWords = Object.keys(learnTranslations);
    const message = escape([learnMessage, repeatMessage].join('\n\n\n'));

    ctx.reply({
      text: `*Next message to be dispatched at ${MESSAGE_SEND_TIME}:*\n\n${message}`,
      // @ts-ignore
      parse_mode: 'MarkdownV2',
      disable_web_page_preview: true,
    });

    return { message, usedWords };
  };

  const sendMessage = async (messageParams: { message: string; usedWords: string[] }) => {
    const { message, usedWords } = messageParams;

    await ctx.telegram.sendMessage(TELEGRAM_CHAT_ID, {
      text: message,
      // @ts-ignore
      parse_mode: 'MarkdownV2',
      disable_web_page_preview: true,
    });

    history.push({ date: new Date().toISOString(), words: usedWords });

    writeJson('data/history.json', history);
  };

  if (ctx.message.text === '/start') {
    getMessageSendTimeoutId = scheduleDailyCall<{
      message: string;
      usedWords: string[]
    }>(sendMessage, getMessageParams, MESSAGE_SEND_TIME);
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
