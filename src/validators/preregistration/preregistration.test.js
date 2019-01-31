import { getIn } from 'formik';
import i18n from 'i18n';
import preregistrationValidator from './index';

describe('pre-registration validator', () => {
  it('returns an empty error object when valid', () => {
    const hasErrors = preregistrationValidator({ preregistration: { language: 'en' } });

    expect(Object.keys(hasErrors).length).toBe(0);
  });

  it('returns an object with an error when invalid', () => {
    const hasErrors = preregistrationValidator({ preregistration: { language: 'fr' } });

    expect(getIn(hasErrors, 'preregistration.language'))
      .toBe(i18n.t('preregistration.language.error'));
  })
});
