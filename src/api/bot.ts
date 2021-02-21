import { Scenes, Telegraf } from 'telegraf';
import { BOT_TOKEN } from '../config';

export const bot = new Telegraf<Scenes.SceneContext>(BOT_TOKEN);

bot.telegram.getMe().then((botInfo) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anybot = bot as any;
  anybot.options.username = botInfo.username;
});
