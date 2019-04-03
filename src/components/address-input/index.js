import React from 'react';
import withLocale from 'components/with-locale';
import states from 'data/states';
import FormikField from 'components/formik-field';

const AddressFields = ({ t, addressType }) => {
  return (
    <React.Fragment>
      <FormikField
        name={`basicInfo.${addressType}.street1`}
        labelText={t('basicInfo.addresses.street1.label')}
      />
      <FormikField
        name={`basicInfo.${addressType}.street2`}
        labelText={t('basicInfo.addresses.street2.label')}
      />
      <FormikField
        name={`basicInfo.${addressType}.city`}
        labelText={t('basicInfo.addresses.city.label')}
      />
      <FormikField
        type="select"
        name={`basicInfo.${addressType}.state`}
        options={states}
        labelText={t('basicInfo.addresses.state.label')}
      />
      <FormikField
        name={`basicInfo.${addressType}.zipcode`}
        labelText={t('basicInfo.addresses.zip.label')}
      />
    </React.Fragment>
  )
};

export default withLocale(AddressFields);
