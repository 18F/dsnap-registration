import { shapeOf, string } from './index';
import { t } from 'i18next';
import moment from 'moment'
import { setIn } from 'formik';
import { isEnumeratedEthnicity, isEnumeratedRace } from 'validators';
import { leftPad } from 'utils';

const DATE_FORMAT = 'YYYY-MM-DD';
const OLDEST_VALID_DOB = '1890-01-01';

export const dateSchema = shapeOf({
  month: string()
    .test('validMonth', t('errors.dob.month'), (value) => {
      return moment(leftPad(value), 'MM', true).isValid();
    }),
  day: string()
    .test('validDay', t('errors.dob.day'), (value) => {
      return moment(leftPad(value), 'DD', true).isValid();
    }),
  year: string()
    .test('validYear', t('errors.dob.year'), (value) => {
      return moment(leftPad(value), 'YYYY', true).isValid();
    }),
})
.test('isValidDOB', t('errors.date'), ({ month, day, year }) => {
  if (month && day && year) {
    const safeDay = leftPad(day);
    const safeMonth = leftPad(month);

    const dob = `${year}-${safeMonth}-${safeDay}`;
    const fullDate = moment(dob, DATE_FORMAT, true);

    return fullDate.isValid() &&
      fullDate.isAfter(OLDEST_VALID_DOB);
  }

  return true;
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
    identitySchema.validateSync(member, { abortEarly: false });
  } catch(e) {
    const manyErrors = e.inner;

    if (manyErrors.length) {
      let dateErrors = [];
      let otherErrors = [];

      manyErrors.forEach((error) => {
        const { path, message } = error;

        if (path.indexOf('dob') !== -1) {
          dateErrors.push(message);
        } else {
          otherErrors.push(error)
        }
      });

      errors = {
        ...errors,
        dob: dateErrors
      };

      otherErrors.forEach(({ path, message }) => {
        errors = setIn(errors, `household.members.${index}.${path}`, message);
      });
    } else {
      if (e.path.indexOf('dob') !== -1) {
        errors = errors.setIn(errors, 'dob', [e.message]);
      } else {
        errors = errors.setIn(errors, `household.members.${index}.${e.path}`, e.message);
      }
    }
  }

  return errors;
}

export { validateIdentitySchema };
export default identitySchema;
