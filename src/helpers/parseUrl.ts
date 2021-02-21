export const figmaUrlRegex = /^https?:\/\/www\.figma\.com\/file\/(.+)\//;

export const isFigmaUrl = (url: string): boolean => figmaUrlRegex.test(url);

export const getLayoutKey = (url: string): string => url.match(/^.+\/(.+)\//)[1];
