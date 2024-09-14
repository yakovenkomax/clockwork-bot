import * as process from 'process';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { readJson } from 'utils/readJson';
import { writeJson } from 'utils/writeJson';
import { schedule } from 'bot/schedule';
import { stop } from 'bot/stop';
import { regenerate } from 'bot/regenerate';
import { replaceImage } from 'bot/replaceImage';
import { BotState } from 'types';

try {
  readJson('data/log.json');
} catch (e) {
  writeJson('data/log.json', []);
}

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '');

const botState: BotState = {
  messageData: undefined,
  scheduledTask: undefined,
};

bot.on(message('text'), async (ctx) => {
  if (ctx.message.text.startsWith('/schedule')) {
    await schedule(ctx, botState);
  }

  if (ctx.message.text === '/stop') {
    await stop(ctx, botState);
  }

  if (ctx.message.text === '/regenerate') {
    await regenerate(ctx, botState);
  }

  if (ctx.message.text === '/replaceImage') {
    await replaceImage(ctx, botState);
  }
});

bot.launch();
