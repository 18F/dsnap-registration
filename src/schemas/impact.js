import { buildSchema, shapeOf, bool } from './index';
import { isPositiveNumber } from 'validators';
import { isAffirmative } from 'utils';

const impactSchema = buildSchema(({ Yup, t }) => {
  const expenseSchema = () =>
    shapeOf({
      applicable: Yup.string().nullable(),
      value: Yup.string()
        .when('applicable', {
          is: value => isAffirmative(value),
          then: Yup.string()
            .required(t('errors.required'))
            .test('isPositiveNumber', t('errors.positiveNumber'), isPositiveNumber)
        })
    });

  return shapeOf({
    impact: shapeOf({
      buyFood: bool().nullable().required(t('errors.yesNo')),
      lostOrInaccessibleIncome: bool().nullable().required(t('errors.yesNo')),
      inaccessibleMoney: bool().nullable().required(t('errors.yesNo')),
      otherExpenses: shapeOf({
        repairs: expenseSchema(),
        tempShelter: expenseSchema(),
        evacuation: expenseSchema(),
        foodLoss: expenseSchema(),
        other: expenseSchema()
      })
    })
  });
});

export default impactSchema;
