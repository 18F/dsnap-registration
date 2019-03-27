import { buildSchema, shapeOf, string } from './index';
import moment from 'moment'
import { setIn } from 'formik';

const identitySchema = buildSchema(({ _, t }) =>
  shapeOf({
    dob: shapeOf({
      month: string()
        .test('validMonth', t('errors.dob.month'), (value) => {
          return moment(value, 'MM').isValid();
        }),
      day: string()
        .test('validDay', t('errors.dob.day'), (value) => {
          return moment(value, 'DD').isValid();
        }),
      year: string()
        .test('validYear', t('errors.dob.year'), (value) => {
          return moment(value, 'YYYY').isValid();
        }),
    })
    .test('isValidDOB', t('errors.date'), ({ month, day, year }) => {
      if (month && day && year) {
        const dob = `${year}-${month}-${day}`;
        const fullDate = moment(dob, 'YYYY-MM-DD');

        return fullDate.isValid() &&
          fullDate.isAfter('1890-01-01') &&
          fullDate.isBefore('2009-12-31');
      }

      return true;
    }),
    ssn: string()
      .test('isValidSSN', t('errors.ssn'), (value) => {
        value = value.replace(/[^\d]/g, '');
        return value.length === 9;
      })
  })
);

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
