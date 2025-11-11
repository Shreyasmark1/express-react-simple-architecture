export const pick = (object: Record<string, any>, keys: string[]): Record<string, any> => {
  return keys.reduce((result, key) => {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      result[key] = object[key];
    }
    return result;
  }, {} as Record<string, any>);
};
