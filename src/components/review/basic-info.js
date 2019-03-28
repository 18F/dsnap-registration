import React from 'react';
import withLocale from 'components/with-locale';
import withUpdateable from 'components/with-updateable';
import YesNoField from 'components/yes-no-field';
import FormikField, { FormikFieldGroup, FormikRadioGroup } from 'components/formik-field';
import ReviewSubSection from 'components/review-subsection';
import ReviewTable from 'components/review-table';
import { isAffirmative } from 'utils';
import { getFirstName, getLastName, getFullName, getDOB } from 'models/person';
import { getApplicant } from 'models/household';
import { getResidenceAddress, getMailingAddress, getID } from 'models/basic-info';
import { buildNestedKey, phoneMaskRegExp } from 'utils';

const formattedAddress = address => (
  !address ?
  <em>N/A</em> :
  <React.Fragment>
    { address.map(line => <span key={line} className="display-block margin-0">{ line }</span>) }
  </React.Fragment>
);

const NullComponent = () => null;

class BasicInfoReview extends React.Component {
  getReviewData() {
    const { handleChange, t, formik } = this.props;
    const { basicInfo, household } = formik.values;
    const applicant = getApplicant(household);

    return [
      {
        name: t('basicInfo.name.id'),
        data: getFullName(applicant),
        component: [
          {
            props: {
              name: buildNestedKey('household', 'members', '0', 'name', 'firstName'),
              onChange: handleChange,
              labelText: t(buildNestedKey('basicInfo', 'name', 'firstName', 'label'))
            },
            Component: FormikField
          },
          {
            props: {
              name: buildNestedKey('household', 'members', '0', 'name', 'middleName'),
              onChange: handleChange,
              labelText: t(buildNestedKey('basicInfo', 'name', 'middleName', 'label')),
            },
            Component: FormikField
          },
          {
            props: {
              name: buildNestedKey('household', 'members', '0', 'name', 'lastName'),
              onChange: handleChange,
              labelText: t(buildNestedKey('basicInfo', 'name', 'lastName', 'label')),
            },
            Component: FormikField
          }
        ]
      },
      {
        name: t('identity.personalInfo.dob.id'),
        data: getDOB(applicant),
        component: {
          props: {
            inline: true,
            compact: true,
            labelText: t(buildNestedKey('identity', 'personalInfo', 'dob', 'label')),
            fields: [{
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
            }]
          },
          Component: FormikFieldGroup
        }
      },
      {
        name: t('identity.personalInfo.ssn.id'),
        data: applicant.ssn,
        component: {
          props: {
            type: 'mask',
            pattern: 'XXX-XX-XXXX',
            delimiter: '-',
            name: 'household.members.0.ssn',
            onChange: handleChange,
            labelText: t(buildNestedKey('identity', 'personalInfo', 'ssn', 'label'))
          },
          Component: FormikField
        }
      },
      {
        name: t('identity.personalInfo.stateId.id'),
        data: getID(basicInfo),
        component: {
          props: {
            name: 'basicInfo.stateId',
            onChange: handleChange,
            labelText: t(buildNestedKey('identity', 'personalInfo', 'stateId', 'label'))
          },
          Component: FormikField
        }
      },
      {
        name: t('identity.personalInfo.sex.id'),
        data: applicant.sex,
        component: {
          props: {
            inline: 'true',
            name: 'household.members.0.sex',
            onChange: handleChange,
            labelText: t(buildNestedKey('identity', 'personalInfo', 'sex', 'label')),
            explanation: t(buildNestedKey('identity', 'personalInfo', 'sex', 'explanation')),
            options: [{
              label: t(buildNestedKey('identity', 'personalInfo', 'sex', 'options', 'male')),
              value: "male"
            },
            {
              label: t(buildNestedKey('identity', 'personalInfo', 'sex', 'options', 'female')),
              value: "female"
            }]
          },
          Component: FormikRadioGroup
        }
      },
      {
        name: t('basicInfo.addresses.id'),
        data: formattedAddress(getResidenceAddress(basicInfo)),
        component: [
          {
            props: {
              name: 'basicInfo.residenceAddress.street1',
              onChange: handleChange,
              labelText: t('basicInfo.addresses.street1.label')
            },
            Component: FormikField
          },
          {
            props: {
              name: 'basicInfo.residenceAddress.street2',
              onChange: handleChange,
              labelText: t('basicInfo.addresses.street2.label'),
            },
            Component: FormikField
          },
          {
            props: {
              name: 'basicInfo.residenceAddress.city',
              onChange: handleChange,
              labelText: t('basicInfo.addresses.city.label')
            },
            Component: FormikField
          },
          {
            props: {
              name: 'basicInfo.residenceAddress.state',
              onChange: handleChange,
              labelText: t('basicInfo.addresses.state.label')
            },
            Component: FormikField
          },
          {
            props: {
              name: 'basicInfo.residenceAddress.zip',
              onChange: handleChange,
              labelText: t('basicInfo.addresses.zip.label')
            },
            Component: FormikField,
          },
          {
            props: {
              name: 'basicInfo.currentMailingAddress',
              onChange: handleChange,
              labelText: t('basicInfo.addresses.currentMailingAddress.label')
            },
            Component: YesNoField
          }
        ],
      },
      {
        name: t('basicInfo.mailingAddress.id'),
        data: formattedAddress(getMailingAddress(basicInfo)),
        component: isAffirmative(basicInfo.currentMailingAddress) ? {
          Component: NullComponent
        } : [
          {
            props: {
              name: 'basicInfo.mailingAddress.street1',
              onChange: handleChange,
              labelText: t('basicInfo.addresses.street1.label'),
            },
            Component: FormikField,
          },
          {
            props: {
              name: 'basicInfo.mailingAddress.street2',
              onChange: handleChange,
              labelText: t('basicInfo.addresses.street2.label')
            },
            Component: FormikField
          },
          {
            props: {
              name: 'basicInfo.mailingAddress.city',
              onChange: handleChange,
              labelText: t('basicInfo.addresses.city.label'),
            },
            Component: FormikField
          },
          {
            props: {
              name: 'basicInfo.mailingAddress.state',
              onChange: handleChange,
              labelText: t('basicInfo.addresses.state.label')
            },
            Component: FormikField
          },
          {
            props: {
              name: 'basicInfo.mailingAddress.zip',
              onChange: handleChange,
              labelText: t('basicInfo.addresses.zip.label')
            },
            Component: FormikField
          }
        ]
      },
      {
        name: t('basicInfo.phone.id'),
        data: basicInfo.phone,
        component: {
          props: {
            type: 'tel',
            pattern: '(XXX)-XXX-XXXX',
            delimiter: phoneMaskRegExp,
            name: 'basicInfo.phone',
            onChange: handleChange,
            labelText: t('basicInfo.phone.label'),
          },
          Component: FormikField
        }
      },
      {
        name: t('basicInfo.email.id'),
        data: basicInfo.email,
        component: {
          props: {
            name: 'basicInfo.email',
            onChange: handleChange,
            labelText: t('basicInfo.email.label'),
          },
          Component: FormikField
        }
      }
    ];
  }

  validateSection = () => {
    const { values } = this.props.formik;
    const { basicInfo } = values;
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
      },
      firstName: getFirstName(applicant),
      lastName: getLastName(applicant),
      dob: {
        month: applicant.dob.month,
        day: applicant.dob.month,
        year: applicant.dob.month
      }
    };

    console.log(sectionData);

    this.props.handleUpdate();
  }

  render() {
    const { t } = this.props;

    return (
      <ReviewSubSection title={t('review.sections.info')} onUpdate={this.validateSection}>
        {({ editing }) => {
          return (
            <ReviewTable
              editing={editing}
              primaryData={this.getReviewData()}
            />
          )
        }}
      </ReviewSubSection>
    );
  }
}

export default withUpdateable(withLocale(BasicInfoReview));
