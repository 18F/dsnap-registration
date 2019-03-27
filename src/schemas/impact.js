import { buildSchema, shapeOf, bool, string } from './index';
import { t } from 'i18next';
import { isPositiveNumber } from 'validators';
import { isAffirmative } from 'utils';

const expenseSchema = () =>
  shapeOf({
    applicable: string().nullable(),
    value: string()
      .when('applicable', {
        is: value => isAffirmative(value),
        then: string()
          .required(t('errors.required'))
          .test('isPositiveNumber', t('errors.positiveNumber'), isPositiveNumber)
      })
  });

export const otherExpensesSchema =
  shapeOf({
    repairs: expenseSchema(),
    tempShelter: expenseSchema(),
    evacuation: expenseSchema(),
    foodLoss: expenseSchema(),
    other: expenseSchema()
  });

const impactSchema = buildSchema(({ Yup, t }) => {
  return shapeOf({
    impact: shapeOf({
      buyFood: bool().nullable().required(t('errors.yesNo')),
      lostOrInaccessibleIncome: bool().nullable().required(t('errors.yesNo')),
      inaccessibleMoney: bool().nullable().required(t('errors.yesNo')),
      otherExpenses: otherExpensesSchema
    })
  });
});

export default impactSchema;
