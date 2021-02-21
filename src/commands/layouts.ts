import { Context } from 'telegraf';
import { MAIN_KEYBOARD } from '../constants/keyboards';
import { findUser, getLayouts } from '../models';

export const onHearLayouts = async (ctx: Context): Promise<void> => {
  const user = await findUser(ctx.from.id);

  const layouts = await getLayouts(user.id);

  const headMarkup =
    layouts.length > 0 ? `\n<strong>Твои макеты:</strong>\n` : `\nОтслеживаемых макетов нет\n`;

  await ctx.replyWithHTML(headMarkup);

  await layouts.forEach((layout) => {
    const markupLayout =
      `\nНазвание: <strong>${layout.title}</strong>` +
      `\nВерсия: <strong>${layout.version}</strong>` +
      `\nСсылка: ${layout.url}`;
    ctx.replyWithHTML(markupLayout, MAIN_KEYBOARD);
  });
};
