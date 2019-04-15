import { buildSchema, shapeOf, bool, string } from './index';
import { isPositiveNumber } from 'validators';
import { isAffirmative } from 'utils';

const expenseSchema = buildSchema(({ t }) => 
  shapeOf({
    applicable: string().nullable(),
    value: string()
      .when('applicable', {
        is: value => isAffirmative(value),
        then: string()
          .required(t('errors.required'))
          .test('isPositiveNumber', t('errors.positiveNumber'), isPositiveNumber)
      })
  })
);

const expensesSchema = shapeOf({
  repairs: expenseSchema,
  tempShelter: expenseSchema,
  evacuation: expenseSchema,
  foodLoss: expenseSchema,
  other: expenseSchema
});

const impactSchema = buildSchema(({ Yup, t }) => {
  return shapeOf({
    impact: shapeOf({
      buyFood: bool().nullable().required(t('errors.yesNo')),
      lostOrInaccessibleIncome: bool().nullable().required(t('errors.yesNo')),
      inaccessibleMoney: bool().nullable().required(t('errors.yesNo')),
      otherExpenses: expensesSchema
    })
  });
});

export { expensesSchema }
export default impactSchema;
