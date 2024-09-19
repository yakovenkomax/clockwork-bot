import * as process from 'process';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { readJson } from 'utils/readJson';
import { writeJson } from 'utils/writeJson';
import { schedule } from 'bot/schedule';
import { stop } from 'bot/stop';
import { replaceAll } from 'bot/replaceAll';
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
  message: undefined,
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

    case ctx.message.text === '/replace_all':
      await replaceAll(ctx, botState);
      break;

    case ctx.message.text === '/replace_image':
      await replaceImage(ctx, botState);
      break;

    case ctx.message.text.startsWith('/'):
      await ctx.reply(`Received an unknown command: "${ctx.message.text}"`);
  }
});

bot.launch();
