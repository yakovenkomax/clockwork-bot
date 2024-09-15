import cron from 'node-cron';
import { generateMessage } from 'generateMessage';
import { getLocalDate } from 'utils/getLocalDate';
import process from 'process';
import { readJson } from 'utils/readJson';
import { generateLogEntry } from 'generateLogEntry';
import { writeJson } from 'utils/writeJson';
import { BotState, TelegramMessageContext } from 'types';

export const schedule = async (ctx: TelegramMessageContext, botState: BotState) => {
  const timeString = ctx.message.text.split(' ')[1];

  console.log('"/schedule" command received with time:', timeString);

  const [hours, minutes] = timeString.split(':').map(Number);
  const cronExpression = `${minutes} ${hours} * * *`;

  if (cron.validate(cronExpression)) {
    if (!botState.messageData) {
      botState.messageData = await generateMessage();

      console.log(`Generated a message with words: ${Object.keys(botState.messageData.learnDictionary)}.`);
      ctx.replyWithPhoto(botState.messageData.image, {
        caption: botState.messageData.message,
        parse_mode: 'MarkdownV2',
      });
    }

    botState.scheduledTask = cron.schedule(cronExpression, async () => {
      const timestamp = getLocalDate();

      if (!botState.messageData) {
        console.log('⚠️ No message is available for sending, skipping...');
      } else {
        await ctx.telegram.sendPhoto(process.env.TELEGRAM_CHAT_ID || '', botState.messageData.image, {
          caption: botState.messageData.message,
          parse_mode: 'MarkdownV2',
        });

        console.log(`✅ Message sent at: ${timestamp}.\n`);

        const log = readJson('data/log.json');

        log.push(generateLogEntry(timestamp, botState.messageData.learnDictionary));

        writeJson('data/log.json', log);

        botState.messageData = await generateMessage();

        console.log(`Generated a message with words: ${Object.keys(botState.messageData.learnDictionary)}.`);
        ctx.replyWithPhoto(botState.messageData.image, {
          caption: botState.messageData.message,
          parse_mode: 'MarkdownV2',
        });
      }
    });
  } else {
    console.log('Incorrect time received in "/schedule" command:', timeString);
    ctx.reply('Please provide a valid time in the format "/schedule HH:MM".');
  }
};