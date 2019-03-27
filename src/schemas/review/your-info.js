import { setIn } from 'formik';
import { shapeOf } from 'schemas';
import { memberNameSchema } from 'schemas/name';
import { dateSchema, ssnSchema } from 'schemas/identity';
import {
  addressSchema,
  mailingAddressSchema,
  phoneSchema,
  emailSchema,
  currentMailingAddressSchema
} from 'schemas/applicant-info';

const yourInfoReviewSchema = ({ state }) =>
  shapeOf({
    basicInfo: shapeOf({
      phone: phoneSchema,
      email: emailSchema,
      residenceAddress: addressSchema(state),
      mailingAddress: mailingAddressSchema,
      currentMailingAddress: currentMailingAddressSchema,
    }),
    household: shapeOf({
      members: shapeOf({
        0: shapeOf({
          name: memberNameSchema,
          ssn: ssnSchema
        })
      })
    }),
    dob: dateSchema,
  });

const infoReviewSchemaValidator = (schema, values) => {
  let errors = {};

  try {
    schema.validateSync(values)
  } catch (e) {
    errors = setIn(errors, e.path, e.message)
  }

  return errors;
};

export { infoReviewSchemaValidator };
export default yourInfoReviewSchema;
