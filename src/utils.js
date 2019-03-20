const YES = 'yes';

export const buildNestedKey = (baseKey = '', ...keys) =>
  keys.reduce((prevKeys, key) => `${prevKeys}.${key}` , baseKey);

// TODO: technically i guess we need to guard against arrays + objects
// as well...
export const isAffirmative = value =>
  value !== null &&
  value !== undefined && 
  value !== false &&
  (value === "true" || value === true || value.toLowerCase() === YES);

export const phoneMaskRegExp = /[()-]/;
