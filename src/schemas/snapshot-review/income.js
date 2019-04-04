import { shapeOf, arrayOf } from 'schemas';
import { jobDetailsSchema } from 'schemas/job';
import currencyValueSchema from 'schemas/currency-value';

const incomeReviewValidator = (values) => {
  let errors = {};

  try {
    incomeReviewSchema.validateSync(values, {abortEarly: false });
  } catch(e) {
    errors = e
  }

  return errors;
};

const incomeReviewSchema = shapeOf({
  household: shapeOf({
    members: arrayOf(
      shapeOf({
        assetsAndIncome: shapeOf({
          jobs: arrayOf(
            shapeOf({
              ...jobDetailsSchema
            })
          ),
          incomeSources: shapeOf({
            selfEmployed: currencyValueSchema,
            unemployment: currencyValueSchema,
            cashAssistance: currencyValueSchema,
            disability: currencyValueSchema,
            socialSecurity: currencyValueSchema,
            veteransBenefits: currencyValueSchema,
            alimony: currencyValueSchema,
            childSupport: currencyValueSchema,
            otherSources: currencyValueSchema,
          })
        })
      })
    )
  })
});

export { incomeReviewValidator };
export default incomeReviewSchema;
