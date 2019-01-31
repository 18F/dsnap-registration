export const buildNestedKey = (baseKey = '', ...keys) =>
  keys.reduce((prevKeys, key) => `${prevKeys}.${key}` , baseKey);