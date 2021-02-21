import { getModelForClass, prop } from '@typegoose/typegoose';
import { User, findUser } from './User';
import { figma } from '../api/figma';
import { getLayoutKey } from '../helpers/parseUrl';

export class Layout {
  @prop()
  public title: string;

  @prop()
  public url: string;

  @prop({ default: '' })
  public version?: string;
}

export const LayoutModel = getModelForClass(Layout);

export const getLayouts = async (userId: User['id']): Promise<Layout[]> => {
  const user = await findUser(userId);

  return user.layouts;
};

export const addLayout = async (userId: User['id'], { title, url }: Layout): Promise<void> => {
  const user = await findUser(userId);

  const isFullDuplicate = user.layouts.find(
    (layout) => layout.url === url && layout.title === title
  );

  const isUrlDuplicate = user.layouts.find(
    (layout) => layout.url === url && layout.title !== title
  );

  const isTitleDuplicate = user.layouts.find(
    (layout) => layout.title === title && layout.url !== url
  );

  try {
    if (title && url) {
      if (isFullDuplicate) {
        await Promise.reject('Такой макет уже отслеживается.');
      } else if (isUrlDuplicate) {
        await Promise.reject('Макет с этой ссылкой уже отслеживается.');
      } else if (isTitleDuplicate) {
        await Promise.reject('Макет с этим названием уже отслеживается.');
      } else {
        const fileKey = getLayoutKey(url);

        const versionsRaw = await figma.getVersions(fileKey);

        const version = versionsRaw.versions[0].label ? versionsRaw.versions[0].label : 'autosave';

        const layout = await new LayoutModel({ title, url, version });

        const newLayouts = [...user.layouts, layout];

        await user.updateOne({ layouts: newLayouts });
      }
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const updateLayout = async (
  userId: User['id'],
  layout: Pick<Layout, 'url' | 'version'>
): Promise<void> => {
  const user = await findUser(userId);

  const newLayouts = user.layouts.map((_layout) =>
    _layout.url === layout.url
      ? { title: _layout.title, url: _layout.url, version: layout.version }
      : _layout
  );

  await user.updateOne({ layouts: newLayouts });
};

export const removeLayout = async (userId: User['id'], title: Layout['title']): Promise<void> => {
  const user = await findUser(userId);

  try {
    if (!user.layouts.find((layout) => layout.title === title)) {
      await Promise.reject('Макет с таким названием не найден.');
    } else {
      const newLayouts = user.layouts.filter((layout) => layout.title !== title);

      await user.updateOne({ layouts: newLayouts });
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const removeAllLayouts = async (userId: User['id']): Promise<void> => {
  const user = await findUser(userId);

  const newLayouts = [];

  await user.updateOne({ layouts: newLayouts });
};
