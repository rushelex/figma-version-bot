import { Scenes } from 'telegraf';
import { BACK_BUTTON } from '../constants/buttons';
import { BACK_KEYBOARD, MAIN_KEYBOARD } from '../constants/keyboards';
import { addLayout, findUser } from '../models';
import { isFigmaUrl } from '../helpers/parseUrl';

const { leave } = Scenes.Stage;

export const ADD_LAYOUT_SCENE = 'ADD_LAYOUT_SCENE';

export const addLayoutScene = new Scenes.BaseScene<Scenes.SceneContext>(ADD_LAYOUT_SCENE);

const callbackMarkup =
  `Хочешь добавить еще макет? Просто отправь ссылку на него.\n` +
  `Для возврата в меню нажми на кнопку "${BACK_BUTTON}"`;

export const initAddLayoutScene = (): void => {
  let title = '';
  let url = '';

  const clearData = () => {
    title = '';
    url = '';
  };

  addLayoutScene.enter(
    async (ctx) => await ctx.reply('Отправь ссылку на макет в Фигме', BACK_KEYBOARD)
  );

  addLayoutScene.leave(async (ctx) => {
    const user = await findUser(ctx.from.id);

    const message = user.layouts.length === 0 ? 'Выходим в меню' : 'Congrats! Жди обновлений 😉';

    title = '';
    url = '';

    await ctx.reply(message, MAIN_KEYBOARD);
  });

  addLayoutScene.hears(BACK_BUTTON, leave<Scenes.SceneContext>());

  addLayoutScene.hears(/\Bссылк(.+?макет)?\B.+/i, async (ctx) => {
    await ctx.reply('Ха-ха, очень смешно.');
  });

  addLayoutScene.on('text', async (ctx) => {
    const tempUrl = await ctx.message.text;
    const tempTitle = await ctx.message.text;

    const user = await findUser(ctx.from.id);

    try {
      if (isFigmaUrl(tempUrl)) {
        url = tempUrl;
        await ctx.reply('А теперь скажи, как ты хочешь назвать этот макет?');
      } else {
        if (!url) {
          await ctx.reply('Нужно написать ссылку на макет');
        } else {
          title = tempTitle;
          await addLayout(user.id, { title, url });
          clearData();
          await ctx.reply(callbackMarkup);
        }
      }
    } catch (error) {
      clearData();
      await ctx.replyWithHTML(`<strong>${error.message}</strong>\n\n` + callbackMarkup);
    }
  });
};
