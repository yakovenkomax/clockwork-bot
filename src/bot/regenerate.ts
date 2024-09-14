import { generateMessage } from 'generateMessage';
import { BotState, TelegramMessageContext } from 'types';

export const regenerate = async (ctx: TelegramMessageContext, botState: BotState) => {
  console.log('"/regenerate" command received.');

  if (botState.messageData) {
    botState.messageData = await generateMessage();

    console.log(`Generated a message with words: ${Object.keys(botState.messageData.learnDictionary)}.`);
    await ctx.replyWithPhoto(botState.messageData.image, {
      caption: botState.messageData.message,
      parse_mode: 'MarkdownV2',
    });
  } else {
    await ctx.reply('There is no message to regenerate.');
  }
};
