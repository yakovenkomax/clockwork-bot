import { createMessage } from 'createMessage';
import { BotState, TelegramMessageContext } from 'types';

export const replaceAll = async (ctx: TelegramMessageContext, botState: BotState) => {
  console.log('"/replaceAll" command received.');

  if (botState.messageData) {
    botState.messageData = await createMessage();

    console.log(`Generated a message with words: ${Object.keys(botState.messageData.learnDictionary)}.`);
    await ctx.replyWithPhoto(botState.messageData.image, {
      caption: botState.messageData.message,
      parse_mode: 'MarkdownV2',
    });
  } else {
    await ctx.reply('There is no message to recreate.');
  }
};
