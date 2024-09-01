# Clockwork Bot
A Telegram bot for learning foreign words.

## Setup

1. Create a Telegram Bot using [@BotFather](https://t.me/botfather);

1. Create a Telegram Channel and add the bot as an admin. Then, get the channel ID by sending a message to the bot and checking the `chat.id` field in the response;

1. Create `.env` file and add the channel ID and the bot token to it.

1. Generate translations with clockwork-generate package or another way. Check the `Translations` type in `src/types/file.types.ts` for the required format.

1. Place a file with translations to `data/translations.json`.

1. Run `npm install` to install dependencies.

## Usage

1. Run `npm run start` to start the bot;

## Commands

Send a message to the bot to trigger actions:

- `/start` - Start the bot; the next message will be scheduled.
- `/stop` - Stop the bot.

