import { buildSchema, shapeOf, string } from 'schemas';
import { isPositiveNumber } from 'validators';

const currencyValueSchema = buildSchema(({ t }) =>
  shapeOf({
    value: string()
      .required(t('errors.required'))
      .test('isPositiveNumber', t('errors.positiveNumber'), isPositiveNumber),
  })
);

export default currencyValueSchema;
