import * as process from 'process';
import { Telegraf } from 'telegraf';
import { readJson } from 'utils/readJson';
import { message } from 'telegraf/filters';
import { scheduleDailyCall } from 'scheduleDailyCall';
import { History, Translations } from 'types/files.types';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';
const MESSAGE_SEND_TIME = '09:00';

let history: History;
const translations: Translations = readJson('data/translations.json');

try {
  history = readJson('data/history.json');
} catch (e) {
  history = [];
}

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

bot.on(message('text'), async (ctx) => {
  let getTimeoutId: (() => number) | undefined = undefined;

  if (ctx.message.text === '/start') {
    getTimeoutId = scheduleDailyCall(async () => {
      await ctx.telegram.sendMessage(TELEGRAM_CHAT_ID, `Hello world!`)
    }, MESSAGE_SEND_TIME);

    await ctx.reply(`A message is scheduled to be sent at ${MESSAGE_SEND_TIME} every day.`);
  }

  if (ctx.message.text === '/stop') {
    if (getTimeoutId) {
      clearTimeout(getTimeoutId());

      await ctx.reply('The scheduled message has been stopped.');
    } else {
      await ctx.reply('There is no scheduled message to stop.');
    }
  }
});

bot.launch();
