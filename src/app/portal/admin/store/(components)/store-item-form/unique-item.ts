/**
 * Adds an item to a list only if it doesn't already exist based on a key function
 */
export const addUniqueItem = <T>(list: T[], item: T, keyFn: (i: T) => unknown): T[] => {
  return list.some((i) => keyFn(i) === keyFn(item)) ? list : [...list, item];
};
