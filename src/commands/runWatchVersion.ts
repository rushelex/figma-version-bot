import { bot } from '../api/bot';
import { figma } from '../api/figma';
import { getAllUsers, updateLayout } from '../models';
import { getLayoutKey } from '../helpers/parseUrl';

export const runWatchVersion = async (): Promise<void> => {
  setInterval(async () => {
    const users = await getAllUsers();

    users.forEach((user) => {
      user.layouts.forEach(async (layout) => {
        const key = getLayoutKey(layout.url);

        const layoutVersions = await figma.getVersions(key);

        const lastNamedVersion = layoutVersions.versions.find((version) => !!version.label);

        if (!!lastNamedVersion && lastNamedVersion.label !== layout.version) {
          const messageMarkup =
            `⚠️ *Макет "${layout.title}" обновился* ⚠️\n`.replace(/\./g, '\\.') +
            `\nВерсия: *${lastNamedVersion.label}*`.replace(/\./g, '\\.') +
            `\nАвтор: *${lastNamedVersion.user.handle}*`.replace(/\./g, '\\.') +
            `\nСсылка: ${layout.url}`.replace(/[.\-=]/g, '\\.');

          await updateLayout(user.id, {
            url: layout.url,
            version: lastNamedVersion.label,
          });

          await bot.telegram.sendMessage(user.id, messageMarkup, { parse_mode: 'MarkdownV2' });
        }
      });
    });
  }, 1000 * 5);
};
