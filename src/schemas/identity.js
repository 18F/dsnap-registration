import { shapeOf, string } from './index';
import { t } from 'i18next';
import moment from 'moment'
import { setIn } from 'formik';
import { isEnumeratedEthnicity, isEnumeratedRace } from 'validators';
import { leftPad } from 'utils';

// TODO make these configuarable
const DATE_FORMAT = 'YYYY-MM-DD';
const OLDEST_VALID_DOB = '1890-01-01';

export const dateSchema = shapeOf({
  month: string(),
  day: string(),
  year: string()
})
.test('isValidDOB', t('errors.date'), ({ month, day, year }) => {
  if (!month && !day && !year) {
    return true;
  }

  const safeDay = leftPad(day);
  const safeMonth = leftPad(month);

  const dob = `${year}-${safeMonth}-${safeDay}`;
  const fullDate = moment(dob, DATE_FORMAT, true);

  return fullDate.isValid() &&
    fullDate.isAfter(OLDEST_VALID_DOB);
});

export const ssnSchema = string()
  .test('isValidSSN', t('errors.ssn'), (value) => {
    if (!value) {
      return true;
    }

    value = value.replace(/[^\d]/g, '');
    return value.length === 9;
  });

export const raceSchema = string() 
  .test('isEnumeratedRace', t('errors.ethnicity'), isEnumeratedRace);
export const ethnicitySchema = string()
  .test('isEnumeratedEthnicity', t('errors.ethnicity'), isEnumeratedEthnicity);

const identitySchema = shapeOf({
  dob: dateSchema,
  ssn: ssnSchema,
  race: raceSchema,
  ethnicity: ethnicitySchema
});

const validateIdentitySchema = (member, index) => () => {
  let errors = {};

  try {
    identitySchema.validateSync(member);
  } catch(e) {
    if (e.path.indexOf('dob') !== -1) {
      errors = setIn(errors, 'dob', e.message);
    } else {
      errors = setIn(errors, `household.members.${index}.${e.path}`, e.message);
    }
  }

  return errors;
}

export { validateIdentitySchema };
export default identitySchema;
