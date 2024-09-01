# Clockwork Bot

A Telegram bot for learning foreign words.

## Setup

1. Create a Telegram Bot using [@BotFather](https://t.me/botfather);

1. Create a Telegram Channel and add the bot as an admin. Then, get the channel ID by sending a message to the bot and
   checking the `chat.id` field in the response;

1. Create `.env` file and add the Telegram channel ID, Telegram bot token, and OpenAI API key.

1. Run `npm install` to install dependencies.

## Usage

1. Run `npm run start` to start the bot;

## Commands

Send a message to the bot to trigger actions:

- `/start` - Start the bot; the next message will be scheduled.
- `/stop` - Stop the bot.

