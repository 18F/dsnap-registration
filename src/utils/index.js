const YES = 'yes';

// Invalid character are, for now, defined as any non-alpha numeric character
export const invalidCharsRegexp = new RegExp('[^\\dA-Za-z]', 'g');
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

export class Mask {
  constructor({ pattern, delimiter }) {
    this.pattern = pattern;
    this.delimiter = delimiter;
  }

  trimRemaining(string, length) {
    return string.slice(0, length);
  }
 
  delimiterRegexp(delimiter) {
    return delimiter instanceof RegExp;
  }

  matchesDelimiter(char, delimiter) {
    if (this.delimiterRegexp(delimiter)) {
      return delimiter.test(char);
    }

    return char === delimiter;
  }

  demask(value, delimiter, invalidChars) {
    return String(value)
      .split(delimiter)
      .join('')
      .replace(invalidChars, '');
  }

  processMask(valueToMask, delimiter, pattern) {
    const valLen = valueToMask.length;
    let valuePtr = 0;
    let patternPtr = 0;
    let memo = '';

    // TODO: this is inefficient as it runs this whole algo each time the 
    // input value is updated. invesitgate storing a pointer
    // to the last position, as well as keeping track of if the user
    // is appending or removing from the string value (maybe via length?)
    while (valuePtr < valLen) {
      const currPattern = pattern[patternPtr];
      let nextChar;

      if (this.matchesDelimiter(currPattern, delimiter)) {
        nextChar = this.delimiterRegexp(delimiter) ? currPattern : delimiter;
        patternPtr += 1;
      } else {
        nextChar = valueToMask[valuePtr];
        valuePtr += 1;
        patternPtr += 1;
      }

      memo = `${memo}${nextChar}`;
    }

    return memo;
  }

  formatValue(value) {
    const { pattern, delimiter } = this;
    const demaskedValue = this.demask(value, delimiter, invalidCharsRegexp);
    const rawMaskedValue = this.processMask(demaskedValue, delimiter, pattern);

    return this.trimRemaining(rawMaskedValue, pattern.length);
  }
}