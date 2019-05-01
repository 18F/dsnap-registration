import React from 'react';
import FormikField from 'components/formik-field';
import withLocale from 'components/with-locale';

const NameFields = ({ memberIndex = 0, t }) => {
  const labelKey = memberIndex ? 
    'household.memberNames' :
    'basicInfo.name';

  return (
    <React.Fragment>
      <FormikField
        name={`household.members.${memberIndex}.name.firstName`}
        labelText={t(`${labelKey}.firstName.label`)}
      />
      <FormikField
        name={`household.members.${memberIndex}.name.middleName`}
        labelText={t(`${labelKey}.middleName.label`)}
      />
      <FormikField
        name={`household.members.${memberIndex}.name.lastName`}
        labelText={t(`${labelKey}.lastName.label`)}
      />
    </React.Fragment>
  );
};

export default withLocale(NameFields);
