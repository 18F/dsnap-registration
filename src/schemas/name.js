import { shapeOf, arrayOf, string } from './index';
import { t } from 'i18next';

export const memberNameSchema = shapeOf({
  firstName: string()
    .required(t('errors.firstName')),
  lastName: string()
    .required(t('errors.lastName'))
});

const nameSchema = shapeOf({
  household: shapeOf({
    members: arrayOf(
      shapeOf({
        name: memberNameSchema
      })
    )
  })
});

export default nameSchema;
