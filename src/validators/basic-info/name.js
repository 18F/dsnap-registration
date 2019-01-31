import i18n from 'i18n';

export default ({ firstName, lastName }) => {
  let errors = {};

  if (!firstName) {
    errors['name'] = { firstName: i18n.t('errors.required') };
  } else if (!lastName) {
    errors['name'] = { lastName: i18n.t('errors.required') };
  }

  return errors;
};
