import { setIn } from 'formik';
import { shapeOf, arrayOf } from 'schemas';
import { memberNameSchema } from 'schemas/name';
import { dateSchema, ssnSchema } from 'schemas/identity';

const householdReviewSchema = shapeOf({
  household: shapeOf({
    members: arrayOf(
      shapeOf({
        name: memberNameSchema,
        ssn: ssnSchema,
        dob: dateSchema
      })
    )
  })
});

const householdReviewValidator = (values) => {
  let errors = {};

  try {
    householdReviewSchema.validateSync(values, { abortEarly: false });
  } catch(e) {
    return e;
  }

  return errors;
};

export { householdReviewValidator };
export default householdReviewSchema;
