import React from 'react';
import Wizard from 'components/wizard';
import withLocale from 'components/with-locale';
import FormikField, { FormikFieldGroup, FormikRadioGroup } from 'components/formik-field';
import Review from './index';
import { getFullName, getDOB } from 'models/person';
import { getApplicant } from 'models/household';
import { getID } from 'models/identity';
import { getResidenceAddress, getMailingAddress } from 'models/basic-info';
import { buildNestedKey } from 'utils';

const formattedAddress = address => (
  !address ?
  <em>N/A</em> :
  <React.Fragment>
    { address.map(line => <span key={line} className="display-block margin-0">{ line }</span>) }
  </React.Fragment>
);

class BasicInfoReview extends React.Component {
  render() {
    const { t, handleChange } = this.props;

    return (
      <Wizard.Context>
        { ({ basicInfo, identity, household }) => {
          const applicant = getApplicant(household);

          const reviewData = [
            {
              name: t('basicInfo.name.id'),
              data: getFullName(applicant),
              Component: () => (
                <React.Fragment>
                  <FormikField
                    name={buildNestedKey('household', 'members', '0', 'name', 'firstName')}
                    onChange={handleChange}
                    labelText={t(buildNestedKey('basicInfo', 'name', 'firstName', 'label'))}
                  />
                  <FormikField
                    name={buildNestedKey('household', 'members', '0', 'name', 'middleName')}
                    onChange={handleChange}
                    labelText={t(buildNestedKey('basicInfo', 'name', 'middleName', 'label'))}
                  />
                  <FormikField
                    name={buildNestedKey('household', 'members', '0', 'name', 'lastName')}
                    onChange={handleChange}
                    labelText={t(buildNestedKey('basicInfo', 'name', 'lastName', 'label'))}
                  />
                </React.Fragment>
              )
            },
            {
              name: t('identity.personalInfo.dob.id'),
              data: getDOB(applicant),
              Component: () => (
                <React.Fragment>
                  <FormikFieldGroup
                    inline
                    compact
                    labelText={t(buildNestedKey('identity', 'personalInfo', 'dob', 'label'))}
                    fields={[{
                      name: 'household.members.0.dob.month',
                      onChange: handleChange,
                      labelText: t(buildNestedKey('identity', 'personalInfo', 'dob', 'month')),
                    }, {
                      name: 'household.members.0.dob.day',
                      labelText: t(buildNestedKey('identity', 'personalInfo', 'dob', 'day')),
                      onChange: handleChange
                    }, {
                      name: 'household.members.0.dob.year',
                      labelText: t(buildNestedKey('identity', 'personalInfo', 'dob', 'year')),
                      onChange: handleChange,
                      className: 'desktop:grid-col-9'
                    }]}
                  />
                </React.Fragment>
              )
            },
            {
              name: t('identity.personalInfo.ssn.id'),
              data: applicant.ssn,
              Component: () => (
                <FormikField
                  name="household.members.0.ssn"
                  onChange={handleChange}
                  labelText={t(buildNestedKey('identity', 'personalInfo', 'ssn', 'label'))}
                />
              )
            },
            {
              name: t('identity.personalInfo.stateId.id'),
              data: getID(identity),
              Component: () => (
                <FormikField
                  name="identity.personalInfo.stateId"
                  onChange={handleChange}
                  labelText={t(buildNestedKey('identity', 'personalInfo', 'stateId', 'label'))}
                />
              )
            },
            {
              name: t('identity.personalInfo.sex.id'),
              data: applicant.sex,
              Component: () => (
                <FormikField
                  name="household.members.0.ssn"
                  onChange={handleChange}
                  labelText={t(buildNestedKey('identity', 'personalInfo', 'ssn', 'label'))}
                />
              )
            },
            {
              name: t('basicInfo.addresses.id'),
              data: formattedAddress(getResidenceAddress(basicInfo)),
              Component: () => (
                <React.Fragment>
                  <FormikField
                    name="basicInfo.residenceAddress.street1"
                    onChange={handleChange}
                    labelText={t('basicInfo.addresses.street1.label')}
                  />
                  <FormikField
                    name="basicInfo.residenceAddress.street2"
                    onChange={handleChange}
                    labelText={t('basicInfo.addresses.street2.label')}
                  />
                  <FormikField
                    name="basicInfo.residenceAddress.city"
                    onChange={handleChange}
                    labelText={t('basicInfo.addresses.city.label')}
                  />
                  <FormikField
                    name="basicInfo.residenceAddress.state"
                    onChange={handleChange}
                    labelText={t('basicInfo.addresses.state.label')}
                  />
                  <FormikField
                    name="basicInfo.residenceAddress.zip"
                    onChange={handleChange}
                    labelText={t('basicInfo.addresses.zip.label')}
                  />
                  <FormikRadioGroup
                    options={[{
                      label: t('general.yes'),
                      value: true
                    },
                    {
                      label: t('general.no'),
                      value: false
                    }]}
                    name="basicInfo.currentMailingAddress"
                    onChange={handleChange}
                    labelText={t('basicInfo.addresses.currentMailingAddress.label')}
                  />
                </React.Fragment>
              )
            },
            {
              name: t('basicInfo.addresses.county.id'),
              data: applicant.county,
              Component: () => (
                <FormikField
                  name="basicInfo.county"
                  onChange={handleChange}
                  labelText={t('basicInfo.addresses.county.label')}
                />
              )
            },
            {
              name: t('basicInfo.mailingAddress.id'),
              data: formattedAddress(getMailingAddress(basicInfo)),
              // TODO: this doesnt toggle the mailing address because
              // overall state is only updated when the 'next' handler is called...
              // need to grab current form value here?
              Component: () => (
                basicInfo.currentMailingAddress ? null :
                <React.Fragment>
                  <FormikField
                    name="basicInfo.mailingAddress.street1"
                    onChange={handleChange}
                    labelText={t('basicInfo.addresses.street1.label')}
                  />
                  <FormikField
                    name="basicInfo.mailingAddress.street2"
                    onChange={handleChange}
                    labelText={t('basicInfo.addresses.street2.label')}
                  />
                  <FormikField
                    name="basicInfo.mailingAddress.city"
                    onChange={handleChange}
                    labelText={t('basicInfo.addresses.city.label')}
                  />
                  <FormikField
                    name="basicInfo.mailingAddress.state"
                    onChange={handleChange}
                    labelText={t('basicInfo.addresses.state.label')}
                  />
                  <FormikField
                    name="basicInfo.mailingAddress.zip"
                    onChange={handleChange}
                    labelText={t('basicInfo.addresses.zip.label')}
                  />
                </React.Fragment>
              )
            },
            {
              name: t('basicInfo.phone.id'),
              data: applicant.phone,
              Component: () => (
                <FormikField
                  name="basicInfo.phone"
                  onChange={handleChange}
                  labelText={t('basicInfo.phone.label')}
                />
              )
            },
            {
              name: t('basicInfo.email.id'),
              data: applicant.email,
              Component: () => (
                <FormikField
                  name="basicInfo.email"
                  onChange={handleChange}
                  labelText={t('basicInfo.email.label')}
                />
              )
            }
          ];

          return <Review name="info" data={reviewData} />;
        }}
      </Wizard.Context>
    )
  }
}

export default withLocale(BasicInfoReview);
