import React from 'react';
import Wizard from 'components/wizard';
import withLocale from 'components/with-locale';
import Review from './index';
import { getFullName, getDOB } from 'models/person';
import { getApplicant } from 'models/household';
import { getID } from 'models/identity';
import { getResidenceAddress, getMailingAddress } from 'models/basic-info';

const formattedAddress = address => (
  !address ?
  <em>N/A</em> :
  <React.Fragment>
    { address.map(line => <p className="margin-0">{ line }</p>) }
  </React.Fragment>
);

class BasicInfoReview extends React.Component {
  render() {
    const { t } = this.props;

    return (
      <Wizard.Context>
        { ({ basicInfo, identity, household }) => {
          const applicant = getApplicant(household);

          const reviewData = [
            {
              name: t('basicInfo.name.id'),
              data: getFullName(applicant),
            },
            {
              name: t('identity.personalInfo.dob.id'),
              data: getDOB(applicant),
            },
            {
              name: t('identity.personalInfo.ssn.id'),
              data: applicant.ssn,
            },
            {
              name: t('identity.personalInfo.stateId.id'),
              data: getID(identity),
            },
            {
              name: t('identity.personalInfo.sex.id'),
              data: applicant.sex
            },
            {
              name: t('basicInfo.addresses.id'),
              data: formattedAddress(getResidenceAddress(basicInfo))
            },
            {
              name: t('basicInfo.addresses.county.id'),
              data: applicant.county
            },
            {
              name: t('basicInfo.mailingAddress.id'),
              data: formattedAddress(getMailingAddress(basicInfo))
            },
            {
              name: t('basicInfo.phone.id'),
              data: applicant.phone,
            },
            {
              name: t('basicInfo.email.id'),
              data: applicant.email,
            }
          ];

          return <Review name="info" data={reviewData} />;
        }}
      </Wizard.Context>
    )
  }
}

export default withLocale(BasicInfoReview);
