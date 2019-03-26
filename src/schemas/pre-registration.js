import { buildSchema, shapeOf, string, bool } from './index';

const preRegistrationSchema = buildSchema(({ Yup, t }) => (validCounties) =>
  shapeOf({
    basicInfo: shapeOf({
      disasterIndex: string()
        .nullable()
        .required(t('errors.yesNo')),
      disasterCounty: string()
        .oneOf(validCounties, t('errors.noMatch'))
        .required(t('errors.dropdown'))
    }),
    config: shapeOf({
      useLocalStorage: bool()
        .required(t('errors.yesNo'))
    })
  })
);

export default preRegistrationSchema;
