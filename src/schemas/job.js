import { buildSchema, shapeOf, bool, string } from './index';
import { setIn } from 'formik';

const jobSchema = buildSchema(({ _, t }) => {
  return shapeOf({
    hasOtherJobs: bool()
      .nullable()
      .required(t('errors.yesNo')),
    employerName: string()
      .required(t('errors.required')),
    pay: string()
      .required(t('errors.required')),
    isDsnapAgency: bool()
      .nullable()
      .required(t('errors.yesNo'))
  });
});

const jobSchemaValidator = (dataToValidate, jobErrorPath, index) => () => {
  let errors = {};

  try {
    jobSchema.validateSync(dataToValidate, { abortEarly: false });
  } catch(e) {
    e.inner.forEach((error) => {
      const { path, message } = error;

      if (path === 'hasOtherJobs') {
        errors = setIn(errors, `household.members.${index}.hasOtherJobs`, message);
      } else {
        errors = setIn(errors, `${jobErrorPath}.${error.path}`, message);
      }
    })
  }

  return errors;
}

export { jobSchemaValidator }
export default jobSchema;
