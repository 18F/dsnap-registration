import { setIn } from 'formik';
import { shapeOf } from 'schemas';
import currencyValueSchema from 'schemas/currency-value';

const expenseReviewValidator = (values) => {
  let errors = {};

  try {
    expenseReviewSchema.validateSync(values);
  } catch(e) {
    errors = setIn(errors, e.path, e.message);
  }
  return errors;
}

const expenseReviewSchema = shapeOf({
  impact: shapeOf({
    otherExpenses: shapeOf({
      repairs: currencyValueSchema,
      tempShelter: currencyValueSchema,
      evacuation: currencyValueSchema,
      foodLoss: currencyValueSchema,
      other: currencyValueSchema,
    })
  })
})

export { expenseReviewValidator };
export default expenseReviewSchema;
