import { BotState, TelegramMessageContext } from 'types';

export const stop = async (ctx: TelegramMessageContext, botState: BotState) => {
  console.log('"/stop" command received.');

  if (botState.scheduledTask) {
    botState.scheduledTask.stop();
    await ctx.reply('The scheduled message has been stopped.');
  } else {
    await ctx.reply('There is no scheduled message to stop.');
  }
};
