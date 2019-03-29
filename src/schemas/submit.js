import { shapeOf, bool, string, buildSchema } from './index';

const submitSchema = buildSchema(({ Yup, t }) =>
  shapeOf({
    submit: shapeOf({
      fullName: string(),
      acceptedTerms: bool()
        .nullable()
        .required(t('errors.yesNo')),
      signature: string()
        .test('matchingName', t('errors.matchingName'), function(value) {
          return this.parent.fullName === value;
        })
    })
  })
);

export default submitSchema;
