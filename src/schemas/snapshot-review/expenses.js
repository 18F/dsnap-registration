import { setIn } from 'formik';
import { buildSchema, shapeOf, bool } from 'schemas';
import { moneySchema } from 'schemas/assets';

const expensesReviewValidator = (values) => {
  let errors = {};

  try {
    console.log(expensesReviewSchema())
    expensesReviewSchema().validateSync(values)
  } catch(e) {
    errors = setIn(errors, e.path, e.message);
  }

  return errors;
};

const expensesReviewSchema = () => buildSchema(({ t }) =>
  shapeOf({
    impact: shapeOf({
      buyFood: bool()
        .nullable()
        .required(t('errors.yesNo')),
      lostOrInaccessibleIncome: bool()
        .nullable()
        .required(t('errors.yesNo')),
      inaccessibleMoney: bool()
        .nullable()
        .required(t('errors.yesNo')),
    }),
    basicInfo: moneySchema,
  })
);


export { expensesReviewValidator };
export default expensesReviewSchema;