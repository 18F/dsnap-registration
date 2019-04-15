import { shapeOf, bool, string, buildSchema } from './index';

const submitSchema = buildSchema(({ Yup, t }) =>
  shapeOf({
    submit: shapeOf({
      fullName: string(),
      acceptedTerms: bool()
        .nullable()
        .required(t('errors.yesNo')),
      signature: string()
        .required(t('errors.required'))
    })
  })
);

export default submitSchema;
