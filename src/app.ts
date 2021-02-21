import { Telegraf, Scenes, session } from 'telegraf';
import { bot } from './api/bot';

import { findUser } from './models';

import {
  ADD_LAYOUT_BUTTON,
  REMOVE_LAYOUT_BUTTON,
  MY_LAYOUTS_BUTTON,
  SETTINGS_BUTTON,
  HELP_BUTTON,
} from './constants/buttons';

import { onCommandStart } from './commands/start';
import { onHearLayouts } from './commands/layouts';
import { onCommandSettings } from './commands/settings';
import { onCommandHelp } from './commands/help';
import { runWatchVersion } from './commands/runWatchVersion';

import { initAddLayoutScene, addLayoutScene, ADD_LAYOUT_SCENE } from './scenes/addLayoutScene';
import {
  initRemoveLayoutScene,
  removeLayoutScene,
  REMOVE_LAYOUT_SCENE,
} from './scenes/removeLayoutScene';

const token = process.env.BOT_TOKEN;
if (token === undefined) {
  throw new Error('BOT_TOKEN must be provided!');
}

/** For debug */
bot.use(Telegraf.log());

const stage = new Scenes.Stage<Scenes.SceneContext>([addLayoutScene, removeLayoutScene]);

bot.use(session());

bot.use(stage.middleware());

bot.command('/start', onCommandStart);

bot.hears(MY_LAYOUTS_BUTTON, onHearLayouts);
bot.command('/my_layouts', onHearLayouts);

bot.hears(ADD_LAYOUT_BUTTON, (ctx) => ctx.scene.enter(ADD_LAYOUT_SCENE));
bot.command('/add_layout', (ctx) => ctx.scene.enter(ADD_LAYOUT_SCENE));

bot.hears(REMOVE_LAYOUT_BUTTON, (ctx) => ctx.scene.enter(REMOVE_LAYOUT_SCENE));
bot.command('/remove_layout', (ctx) => ctx.scene.enter(REMOVE_LAYOUT_SCENE));

bot.hears(SETTINGS_BUTTON, onCommandSettings);
bot.command('/settings', onCommandSettings);

bot.hears(HELP_BUTTON, onCommandHelp);
bot.command('/help', onCommandHelp);

initAddLayoutScene();
initRemoveLayoutScene();

bot.launch().then(async () => {
  await runWatchVersion();

  console.log('Bot is started!');
});

/** For debug */
bot.command('/me', async (ctx) => {
  const user = await findUser(ctx.from.id);

  await console.log('/me', user);
});

/** For debug */
// bot.command('/drop_db', async () => {
//   await mongoose.connection.collections['users'].drop(() => {
//     console.log('Users collection dropped!');
//   });
//
//   await mongoose.connection.collections['layouts'].drop(() => {
//     console.log('Layouts collection dropped!');
//   });
//
//   await LayoutModel.deleteMany({});
//   await UserModel.deleteMany({});
// });

/** Enable graceful stop */
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
