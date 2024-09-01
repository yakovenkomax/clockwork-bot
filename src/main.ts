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
import { History, Translations } from 'types/files.type';

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
      const learnTranslations = pickLearnTranslations(translations, history);
      const learnMessage = formatLearnMessage(learnTranslations);
      const repeatTranslations = pickRepeatTranslations(translations, history);
      const repeatMessage = formatRepeatMessage(repeatTranslations);
      const message = escape([learnMessage, repeatMessage].join('\n\n\n'));

      await ctx.telegram.sendMessage(TELEGRAM_CHAT_ID, {
        text: message,
        // @ts-ignore
        parse_mode: 'MarkdownV2',
        disable_web_page_preview: true,
      });

      history.push({
        date: new Date().toISOString(),
        words: Object.keys(learnTranslations),
      });

      writeJson('data/history.json', history);
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
