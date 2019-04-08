const YES = 'yes';

export const supportedLanguages = [ 'en', 'es' ];

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

// Technically, object is a primative too, but things other
// than the strict object constructor ( i.e. {} ) can evaluate
// to an object, e.g. `null`. So just check for the common primitive types
// that we use when deal with inputted form data
export const isPrimitive = value =>
  typeof value === 'string' ||
  typeof value === 'number' ||
  typeof value === 'boolean';

export const stripSpecialChars = (value) =>
  value.replace(/[^0-9A-Za-z]/g, '');
