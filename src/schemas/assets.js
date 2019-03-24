import { buildSchema, shapeOf, arrayOf, string } from './index';
import { isPositiveNumber } from 'validators';

const assetsSchema = buildSchema(({ Yup, t }) =>
  shapeOf({
    basicInfo: shapeOf({
      moneyOnHand: string()
        .required(t('errors.required'))
        .test('isPositiveNumber', t('errors.positiveNumber'), isPositiveNumber)
    })
  })
);

export default assetsSchema;
