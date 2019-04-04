import { setIn } from 'formik';
import { buildSchema, shapeOf, bool } from 'schemas';
import { moneySchema } from 'schemas/assets';

const impactReviewValidator = (values) => {
  let errors = {};

  try {
    impactReviewSchema().validateSync(values)
  } catch(e) {
    errors = setIn(errors, e.path, e.message);
  }

  return errors;
};

const impactReviewSchema = () => buildSchema(({ t }) =>
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


export { impactReviewValidator };
export default impactReviewSchema;
