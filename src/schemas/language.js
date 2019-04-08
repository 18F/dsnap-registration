import { buildSchema, shapeOf, string } from 'schemas';
import { supportedLanguages } from 'utils';

const languageSchema = buildSchema(({ t }) =>
  shapeOf({
    config: shapeOf({
      language: string()
        .oneOf(supportedLanguages, t('errors.language'))
    })
  })
);

export default languageSchema;
