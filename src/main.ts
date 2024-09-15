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
  switch (true) {
    case ctx.message.text.startsWith('/schedule'):
      await schedule(ctx, botState);
      break;

    case ctx.message.text === '/stop':
      await stop(ctx, botState);
      break;

    case ctx.message.text === '/regenerate':
      await regenerate(ctx, botState);
      break;

    case ctx.message.text === '/replaceImage':
      await replaceImage(ctx, botState);
      break;

    case ctx.message.text.startsWith('/'):
      await ctx.reply(`Received an unknown command: "${ctx.message.text}"`);
  }
});

bot.launch();
