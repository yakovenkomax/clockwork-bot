import * as process from 'process';
import { Telegraf } from 'telegraf';
import { readJson } from 'utils/readJson';
import { History, Translations } from './types/files.types';
import { message } from 'telegraf/filters';

let history: History;
const translations: Translations = readJson('data/translations.json');

try {
  history = readJson('data/history.json');
} catch (e) {
  history = [];
}

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '');

bot.on(message('text'), async (ctx) => {
  if (ctx.message.text === '/start') {
    await ctx.reply(`Hello world!`);
  }

  if (ctx.message.text === '/stop') {
    await ctx.reply(`Goodbye world!`);
  }
});

bot.launch();
