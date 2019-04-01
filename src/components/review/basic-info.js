import React from 'react';
import PropTypes from 'prop-types';
import withLocale from 'components/with-locale';
import withUpdateable from 'components/with-updateable';
import YesNoField from 'components/yes-no-field';
import FormikField, { FormikRadioGroup } from 'components/formik-field';
import ReviewSubSection from 'components/review-subsection';
import ReviewTable from 'components/review-table';
import { isAffirmative } from 'utils';
import { getFirstName, getLastName, getFullName, getDOB } from 'models/person';
import { getApplicant } from 'models/household';
import { getResidenceAddress, getMailingAddress, getID } from 'models/basic-info';
import { buildNestedKey, phoneMaskRegExp } from 'utils';
import DateInput from 'components/date-input';
import AddressFields from 'components/address-input';
import { getState, getDisaster } from 'models/disaster';
import yourInfoReviewSchema, { infoReviewSchemaValidator } from 'schemas/your-info';

const formattedAddress = address => (
  !address ?
  <em>N/A</em> :
  <React.Fragment>
    { address.map(line => <span key={line} className="display-block margin-0">{ line }</span>) }
  </React.Fragment>
);

class InfoReviewForm extends React.Component {
  updateMask = (name, data) => {
    this.props.handleChange(name)(data);
  };

  render() {
    const { t, values } = this.props;

    return (
      <div className="margin-bottom-2">
        <FormikField
          name="household.members.0.name.firstName"
          labelText={t('basicInfo.name.firstName.label')}
        />
        <FormikField
          name="household.members.0.name.middleName"
          labelText={t('basicInfo.name.middleName.label')}
        />
        <FormikField
          name="household.members.0.name.lastName"
          labelText={t('basicInfo.name.lastName.label')}
        />
        <DateInput memberIndex={0} />
        <FormikField
          onChange={this.updateMask}
          type="mask"
          pattern="XXX-XX-XXXX"
          delimiter="-"
          name="household.members.0.ssn"
          labelText={t('identity.personalInfo.ssn.label')}
        />
        <FormikField
          name="basicInfo.stateId"
          labelText={t('identity.personalInfo.stateId.label')}
        />
        <FormikRadioGroup
          inline
          name="household.members.0.sex"
          labelText={t('identity.personalInfo.sex.label')}
          explanation={t('identity.personalInfo.sex.explanation')}
          options={[{
            label: t(buildNestedKey('identity', 'personalInfo', 'sex', 'options', 'male')),
            value: "male"
          },
          {
            label: t(buildNestedKey('identity', 'personalInfo', 'sex', 'options', 'female')),
            value: "female"
          }]}
        />
        <AddressFields addressType="residenceAddress" />
        <YesNoField
          name="basicInfo.currentMailingAddress"
          labelText={t('basicInfo.addresses.currentMailingAddress.label')}
        />
        { 
          isAffirmative(values.basicInfo.currentMailingAddress) ?
          null :
          <AddressFields addressType="mailingAddress" />
        }
        <FormikField
          type="tel"
          pattern="(XXX)-XXX-XXXX"
          onChange={this.updateMask}
          delimiter={phoneMaskRegExp}
          name="basicInfo.phone"
          labelText={t('basicInfo.phone.label')}
        />
        <FormikField
          name="basicInfo.email"
          labelText={t('basicInfo.email.label')}
        />
      </div>
    );
  }
}

class BasicInfoReview extends React.Component {
  static propTypes = {
    onEdit: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
  }

  getReviewData() {
    const { t, formik } = this.props;
    const { basicInfo, household } = formik.values;
    const applicant = getApplicant(household);

    return [
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
        data: getID(basicInfo),
      },
      {
        name: t('identity.personalInfo.sex.id'),
        data: applicant.sex,
      },
      {
        name: t('basicInfo.addresses.id'),
        data: formattedAddress(getResidenceAddress(basicInfo)),
      },
      {
        name: t('basicInfo.mailingAddress.id'),
        data: formattedAddress(getMailingAddress(basicInfo)),
      },
      {
        name: t('basicInfo.phone.id'),
        data: basicInfo.phone,
      },
      {
        name: t('basicInfo.email.id'),
        data: basicInfo.email,
      }
    ];
  }

  validateSection = () => {
    const { values } = this.props.formik;
    const { basicInfo, disasters } = values;
    const applicant = getApplicant(values.household);

    const sectionData = {
      basicInfo: {
        phone: basicInfo.phone,
        email: basicInfo.email,
        sex: basicInfo.sex,
        race: basicInfo.race,
        stateId: basicInfo.stateId,
        residenceAddress: basicInfo.residenceAddress,
        mailingAddress: basicInfo.mailingAddress,
        currentMailingAddress: basicInfo.currentMailingAddress,
      },
      household: {
        members: {
          0: {
            ssn: applicant.ssn,
            name: {
              firstName: getFirstName(applicant),
              lastName: getLastName(applicant),
            },
          }
        }
      },
      dob: {
        month: applicant.dob.month,
        day: applicant.dob.day,
        year: applicant.dob.year
      }
    };

    const schema = yourInfoReviewSchema({
      state: getState(getDisaster(disasters, basicInfo.disasterIndex))
    });

    return infoReviewSchemaValidator(schema, sectionData);
  }

  handleToggleEdit = (isEditing) => {
    if (isEditing) {
      this.props.onEdit(this.validateSection);
    }
  }

  render() {
    const { t, formik: { values } } = this.props;

    return (
      <ReviewSubSection
        title={this.props.title}
        onUpdate={this.props.handleUpdate}
        onEdit={this.handleToggleEdit}
      >
        {({ editing }) =>
          editing ?
          <InfoReviewForm t={t} handleChange={this.props.handleChange} values={values} /> :
          <ReviewTable primaryData={this.getReviewData()} />
        }
      </ReviewSubSection>
    );
  }
}

export default withUpdateable(withLocale(BasicInfoReview));
