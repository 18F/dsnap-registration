import React from 'react';
import FormikField from 'components/formik-field';
import withLocale from 'components/with-locale';

const NameFields = ({ memberIndex = 0, t }) =>
  <React.Fragment>
    <FormikField
      name={`household.members.${memberIndex}.name.firstName`}
     labelText={t('basicInfo.name.firstName.label')}
    />
    <FormikField
      name={`household.members.${memberIndex}.name.middleName`}
      labelText={t('basicInfo.name.middleName.label')}
    />
    <FormikField
      name={`household.members.${memberIndex}.name.lastName`}
      labelText={t('basicInfo.name.lastName.label')}
    />
  </React.Fragment>

export default withLocale(NameFields);
