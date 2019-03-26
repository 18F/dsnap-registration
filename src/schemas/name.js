import { buildSchema, shapeOf, arrayOf, string } from './index';

const nameSchema = buildSchema(({ Yup, t }) => {
  return shapeOf({
    household: shapeOf({
      members: arrayOf(
        shapeOf({
          name: shapeOf({
            firstName: string()
              .required(t('errors.lastName')),
            lastName: string()
              .required(t('errors.firstName'))
          })
        })
      )
    })
  });
});

export default nameSchema;
