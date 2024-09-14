import { schedule, validate, ScheduledTask } from 'node-cron';
import * as process from 'process';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { readJson } from 'utils/readJson';
import { writeJson } from 'utils/writeJson';
import { getLocalDate } from 'utils/getLocalDate';
import { MessageData } from 'types';
import { generateMessage } from 'generateMessage';
import { generateLogEntry } from 'generateLogEntry';

try {
  readJson('data/log.json');
} catch (e) {
  writeJson('data/log.json', []);
}

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '');

let messageData: MessageData | undefined;
let scheduledTask: ScheduledTask | undefined;

bot.on(message('text'), async (ctx) => {
  if (ctx.message.text.startsWith('/start')) {
    const timeString = ctx.message.text.split(' ')[1];
    const [hours, minutes] = timeString.split(':').map(Number);
    const cronExpression = `${minutes} ${hours} * * *`;

    if (validate(cronExpression)) {
      console.log('"/start" command received with time:', timeString);

      if (!messageData) {
        messageData = await generateMessage();

        console.log(`Generated a message with words: ${Object.keys(messageData.learnDictionary)}.`);
        ctx.replyWithPhoto(messageData.image, { caption: messageData.message, parse_mode: 'MarkdownV2' });
      }

      scheduledTask = schedule(cronExpression, async () => {
        const timestamp = getLocalDate();

        if (!messageData) {
          console.log('⚠️ No message is available for sending, skipping...');
        } else {
          await ctx.telegram.sendPhoto(process.env.TELEGRAM_CHAT_ID || '', messageData.image, {
            caption: messageData.message,
            parse_mode: 'MarkdownV2',
          });

          console.log(`✅ Message sent at: ${timestamp}.\n`);

          const log = readJson('data/log.json');

          log.push(generateLogEntry(timestamp, messageData.learnDictionary));

          writeJson('data/log.json', log);

          messageData = await generateMessage();

          console.log(`Generated a message with words: ${Object.keys(messageData.learnDictionary)}.`);
          ctx.replyWithPhoto(messageData.image, { caption: messageData.message, parse_mode: 'MarkdownV2' });
        }
      });
    } else {
      console.log('Incorrect time received in "/start" command:', timeString);
      ctx.reply('Please provide a valid time in the format "/start HH:MM".');
    }
  }

  if (ctx.message.text === '/stop') {
    console.log('"/stop" command received.');
    if (scheduledTask) {
      scheduledTask.stop();
      await ctx.reply('The scheduled message has been stopped.');
    } else {
      await ctx.reply('There is no scheduled message to stop.');
    }
  }

  if (ctx.message.text === '/regenerate') {
    console.log('"/regenerate" command received.');
    if (messageData) {
      messageData = await generateMessage();

      console.log(`Generated a message with words: ${Object.keys(messageData.learnDictionary)}.`);
      await ctx.replyWithPhoto(messageData.image, { caption: messageData.message, parse_mode: 'MarkdownV2' });
    } else {
      await ctx.reply('There is no message to regenerate.');
    }
  }
});

bot.launch();
