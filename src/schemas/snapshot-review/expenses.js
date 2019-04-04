import { setIn } from 'formik';
import { buildSchema, shapeOf, string } from 'schemas';
import { isPositiveNumber } from 'validators';

const expenseReviewValidator = (values) => {
  let errors = {};

  try {
    expenseReviewSchema.validateSync(values);
  } catch(e) {
    errors = setIn(errors, e.path, e.message);
  }
  return errors;
}

const expenseReviewSchema = buildSchema(({ t }) =>
  shapeOf({
    impact: shapeOf({
      otherExpenses: shapeOf({
        repairs: shapeOf({
          value: string()
            .required(t('errors.required'))
            .test('isPositiveNumber', t('errors.positiveNumber'), isPositiveNumber),
        }),
        tempShelter: shapeOf({
          value: string()
            .required(t('errors.required'))
            .test('isPositiveNumber', t('errors.positiveNumber'), isPositiveNumber),
        }),
        evacuation: shapeOf({
          value: string()
            .required(t('errors.required'))
            .test('isPositiveNumber', t('errors.positiveNumber'), isPositiveNumber),
        }),
        foodLoss: shapeOf({
          value: string()
            .required(t('errors.required'))
            .test('isPositiveNumber', t('errors.positiveNumber'), isPositiveNumber),
        }),
        other: shapeOf({
          value: string()
            .required(t('errors.required'))
            .test('isPositiveNumber', t('errors.positiveNumber'), isPositiveNumber),
        }),
      })
    })
  })
);

export { expenseReviewValidator };
export default expenseReviewSchema;
