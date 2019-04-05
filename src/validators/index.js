const usPhoneRegExp = /\d{10}/;
const raceEnum = [
  "American Indian or Alaskan Native",
  "Asian",
  "Black or African American",
  "Native Hawaiian or Other Pacific Islander",
  "White"
];
const ethnicityEnum = [
  "Hispanic or Latino",
  "Not Hispanic or Latino",
];

export const isDefined = value => value && typeof value !== 'undefined';

export const isValidPhoneNumber = value => usPhoneRegExp.test(value);

export const isPositiveNumber = value => Number(value) >= 0;

export const required = value => isDefined(value) ? '' : 'This field is required.';

export const isEnumeratedRace = value => {
  if (!value) {
    return true;
  }

  return raceEnum.indexOf(value) !== -1;
};

export const isEnumeratedEthnicity = value => {
  if (!value) {
    return true;
  }

  return ethnicityEnum.indexOf(value) !== -1;
};
