import { Context } from 'telegraf';
import { MAIN_KEYBOARD } from '../constants/keyboards';

export const onCommandStart = async (ctx: Context): Promise<void> => {
  await ctx.reply(`Привет, ${ctx.from.first_name}!`);
  await ctx.reply('Выбери одну из опций:', MAIN_KEYBOARD);
};
