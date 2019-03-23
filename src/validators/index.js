const usPhoneRegExp = /\d{10}/;

export const isDefined = value => value && typeof value !== 'undefined';

export const isValidPhoneNumber = value => usPhoneRegExp.test(value);

export const required = value => isDefined(value) ? '' : 'This field is required.';
