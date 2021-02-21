import { Scenes } from 'telegraf';
import { BACK_BUTTON, REMOVE_ALL_LAYOUTS_BUTTON } from '../constants/buttons';
import { MAIN_KEYBOARD, REMOVE_ALL_LAYOUTS_KEYBOARD } from '../constants/keyboards';
import { findUser, removeAllLayouts, removeLayout } from '../models';

const { leave } = Scenes.Stage;

export const REMOVE_LAYOUT_SCENE = 'REMOVE_LAYOUT_SCENE';

export const removeLayoutScene = new Scenes.BaseScene<Scenes.SceneContext>(REMOVE_LAYOUT_SCENE);

const callbackMarkup =
  `Хочешь удалить еще какой-то макет? Просто отправь его название.\n` +
  `Для возврата в меню нажми на кнопку "${BACK_BUTTON}"`;

export const initRemoveLayoutScene = (): void => {
  removeLayoutScene.enter((ctx) => {
    return ctx.reply(
      'Напиши название макета, который ты хочешь перестать отслеживать',
      REMOVE_ALL_LAYOUTS_KEYBOARD
    );
  });

  removeLayoutScene.leave((ctx) => ctx.reply('Выходим в меню', MAIN_KEYBOARD));

  removeLayoutScene.hears(BACK_BUTTON, leave<Scenes.SceneContext>());

  removeLayoutScene.hears(REMOVE_ALL_LAYOUTS_BUTTON, async (ctx) => {
    const user = await findUser(ctx.from.id);

    const headMarkup =
      user.layouts.length > 0
        ? `\n<strong>Все макеты удалены.</strong>\n`
        : `\n<strong>Отслеживаемых макетов нет.</strong>\n`;

    await removeAllLayouts(user.id);

    await ctx.replyWithHTML(headMarkup, MAIN_KEYBOARD);

    ctx.scene.leave();
  });

  removeLayoutScene.on('text', async (ctx) => {
    const title = ctx.message.text;

    try {
      await removeLayout(ctx.from.id, title);
      await ctx.replyWithHTML(
        `Отныне макет "<strong>${title}</strong>" не отслеживается.\n\n` + callbackMarkup
      );
    } catch (error) {
      await ctx.reply(error.message);
    }
  });
};
