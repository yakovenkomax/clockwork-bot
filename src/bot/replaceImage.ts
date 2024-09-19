import { BotState, TelegramMessageContext } from 'types';
import { getImage } from 'createMessage/getImage';

export const replaceImage = async (ctx: TelegramMessageContext, botState: BotState) => {
  console.log('"/replaceImage" command received.');

  if (botState.messageData) {
    const newImage = await getImage(botState.messageData.learnDictionary);

    botState.messageData = {
      ...botState.messageData,
      image: newImage,
    };

    console.log(`Replaced image for the message with words: ${Object.keys(botState.messageData.learnDictionary)}.`);

    await ctx.replyWithPhoto(botState.messageData.image, {
      caption: botState.message,
      parse_mode: 'MarkdownV2',
    });
  } else {
    await ctx.reply('There is no message to replace an image.');
  }
};
