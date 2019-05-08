import { buildSchema, shapeOf, bool, string } from './index';
import { setIn } from 'formik';

const jobDetailsSchema = buildSchema(({ t }) => ({
  employerName: string()
    .required(t('errors.employerName')),
  pay: string()
    .nullable()
    .required(t('errors.required')),
  isDsnapAgency: bool()
    .nullable()
    .required(t('errors.yesNo'))
}));

const jobSchema = buildSchema(({ _, t }) => {
  return shapeOf({
    hasOtherJobs: bool()
      .nullable()
      .required(t('errors.yesNo')),
    ...jobDetailsSchema
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

export { jobDetailsSchema, jobSchemaValidator }
export default jobSchema;
