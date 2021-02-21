# figma-version-bot

Telegram bot for tracking file versions in Figma.\
Based on [Telegraf 4.0.x](https://telegraf.js.org/)


## Installation and local launch

1. Install [Docker](https://docs.docker.com/get-docker/)
1. Clone this repo: `git clone https://github.com/rushelex/figma-version-bot`
1. Change environment variables in .env file
1. Run `yarn` in the root folder
1. Run `./start-docker.dev.sh`


## Environment variables

- `BOT_TOKEN` — Telegram bot token
- `FIGMA_TOKEN` — Figma token
- `MONGO_URL`— URL of the mongo database



# License

MIT (c) 2021 Aleksey Shelementev
