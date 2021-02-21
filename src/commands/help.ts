import { Context } from 'telegraf';
import { MAIN_KEYBOARD } from '../constants/keyboards';

export const onCommandHelp = async (ctx: Context): Promise<void> => {
  await ctx.reply(
    `Я могу отслеживать макеты в Фигме и присылать уведомление, ` +
      `когда версия отслеживаемого макета изменится. Попробуй 🙂`,
    MAIN_KEYBOARD
  );
};
