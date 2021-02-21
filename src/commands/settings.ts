import { Context } from 'telegraf';
import { MAIN_KEYBOARD } from '../constants/keyboards';

export const onCommandSettings = async (ctx: Context): Promise<void> => {
  await ctx.reply(
    `Я пока не придумал функции для настроек.\nЕсли есть пожелания, пиши в ЛС @rushelex 😉`,
    MAIN_KEYBOARD
  );
};
