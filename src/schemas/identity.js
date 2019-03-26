import { buildSchema, shapeOf, string } from './index';
import { setIn } from 'formik';

const identitySchema = buildSchema(({ _, t }) =>
  shapeOf({
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
    const path = e.inner[0].path;
    errors = setIn(errors, `household.members.${index}.${path}`, e.message);
  }

  return errors;
}

export { validateIdentitySchema };
export default identitySchema;
