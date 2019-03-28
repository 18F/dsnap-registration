import { buildSchema, shapeOf, string } from './index';
import { isPositiveNumber } from 'validators';

const assetsSchema = buildSchema(({ Yup, t }) =>
  shapeOf({
    basicInfo: shapeOf({
      moneyOnHand: string()
        .nullable()
        .required(t('errors.required'))
        .test('isPositiveNumber', t('errors.positiveNumber'), isPositiveNumber)
    })
  })
);

export default assetsSchema;
