import { buildSchema, shapeOf, string, bool } from './index';

const preRegistrationSchema = buildSchema(({ Yup, t }) => (validCounties) =>
  shapeOf({
    basicInfo: shapeOf({
      disasterId: string()
        .nullable()
        .required(t('errors.yesNo')),
      county: string()
        .oneOf(validCounties, t('errors.county'))
        .required(t('errors.county'))
    }),
    config: shapeOf({
      useLocalStorage: bool()
        .nullable()
        .required(t('errors.yesNo'))
    })
  })
);

export default preRegistrationSchema;
