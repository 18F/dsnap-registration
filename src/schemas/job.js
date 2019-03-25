import { buildSchema, shapeOf, bool, string } from './index';
import { setIn } from 'formik';

const jobSchema = buildSchema(({ _, t }) => {
  return shapeOf({
    hasOtherJobs: bool()
      .nullable()
      .required(t('errors.yesNo')),
    newJob: shapeOf({
      employerName: string()
        .required(t('errors.required')),
      pay: string()
        .required(t('errors.required')),
      isDsnapAgency: bool()
        .nullable()
        .required(t('errors.yesNo'))
    })
  });
});

const jobSchemaValidator = (dataToValidate, index) => () => {
  let errors = {};

  try {
    jobSchema.validateSync(dataToValidate);
  } catch(e) {
    debugger
    errors = setIn(errors, e.path, e.message);
  }

  return errors;
}

export { jobSchemaValidator }
export default jobSchema;
