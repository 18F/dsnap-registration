import { buildSchema, shapeOf } from './index';
import { setIn } from 'formik';
import { isPositiveNumber } from 'validators';
import { isAffirmative } from 'utils';

const incomeSchema = buildSchema(({ Yup, t }) => {
  const expenseSchema = () =>
    shapeOf({
      applicable: Yup.mixed().nullable(),
      value: Yup.string()
        .when('applicable', {
          is: value => isAffirmative(value),
          then: Yup.string()
            .required(t('errors.required'))
            .test('isPositiveNumber', t('errors.positiveNumber'), isPositiveNumber)
        })
    });

  return shapeOf({
    assetsAndIncome: shapeOf({
      incomeSources: shapeOf({
        selfEmployed: expenseSchema(),
        unemployment: expenseSchema(),
        cashAssistance: expenseSchema(),
        disability: expenseSchema(),
        socialSecurity: expenseSchema(),
        veteransBenefits: expenseSchema(),
        alimony: expenseSchema(),
        childSupport: expenseSchema(),
        otherSources: expenseSchema(),
      })  
    })
  });
});

const validateIncomeSchema = (members, index) => () => {
  let errors = {};

  try {
    incomeSchema.validateSync(members[index]);
  } catch(e) {
    errors = setIn(errors, `household.members.${index}.${e.path}`, e.message);
  }

  return errors;
};


export { validateIncomeSchema };
export default incomeSchema;