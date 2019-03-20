import React from 'react';
import withLocale from 'components/with-locale';
import withUpdateable from 'components/with-updateable';
import FormikField, { FormikFieldGroup } from 'components/formik-field';
import ReviewSubSection from 'components/review-subsection';
import ReviewTableCollection from 'components/review-table-collection';
import ReviewTable, { Header, HeaderAction} from 'components/review-table';
import Button from 'components/button';
import { getFirstName, getFullName, getDOB } from 'models/person';
import { getOtherMembers, addPeopleToHousehold, deleteMemberFromHousehold } from 'models/household';
import { buildNestedKey, isAffirmative } from 'utils';

class HouseholdReview extends React.Component {
  getMemberData(member, memberIndex) {
    const { t, handleChange } = this.props;

    return [
      {
        name: t('basicInfo.name.id'),
        data: getFullName(member),
        component: [
          {
            props: {
              name: `household.members.${memberIndex}.name.firstName`,
              labelText: t(`household.memberNames.firstName.label`),
              onChange: handleChange
            },
            Component: FormikField
          },
          {
            props: {
              name: `household.members.${memberIndex}.name.middleName`,
              labelText: t(`household.memberNames.middleName.label`),
              onChange: handleChange
            },
            Component: FormikField
          },
          {
            props: {
              name: `household.members.${memberIndex}.name.lastName`,
              labelText: t(`household.memberNames.lastName.label`),
              onChange: handleChange,
            },
            Component: FormikField
          }
        ]
      },
      {
        name: t('identity.personalInfo.dob.id'),
        data: getDOB(member),
        component: {
          props: {
            inline: true,
            compact: true,
            labelText: t(buildNestedKey('household', 'memberDetails', 'dob', 'label'), { firstName: getFirstName(member) }),
            fields: [{
              name: `household.members.${memberIndex}.dob.month`,
              onChange: handleChange,
              labelText: t(buildNestedKey('identity', 'personalInfo', 'dob', 'month')),
            }, {
              name: `household.members.${memberIndex}.dob.day`,
              labelText: t(buildNestedKey('identity', 'personalInfo', 'dob', 'day')),
              onChange: handleChange
            }, {
              name: `household.members.${memberIndex}.dob.year`,
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
        data: member.ssn,
        component: {
          props: {
            type: 'mask',
            pattern: 'XXX-XX-XXXX',
            delimiter: '-',
            name: `household.members.${memberIndex}.ssn`,
            onChange: handleChange,
            labelText: t('household.memberDetails.ssn.label', { firstName: getFirstName(member) })
          },
          Component: FormikField,
        }
      },
    ];
  }

  handleAddMember = () => {
    const { formik, setParentValues } = this.props;
    const { values } = formik;
    const nextState = {
      ...values,
      household: addPeopleToHousehold(values.household, 1),
    };

    formik.setValues(nextState);
    setParentValues(nextState);
  }

  handleRemoveMember(memberIndex) {
    const { formik, setParentValues } = this.props;
    const { household } = formik.values;
    const nextHousehold = deleteMemberFromHousehold(household, memberIndex);
    const nextState = {
      ...formik.values,
      household: nextHousehold
    };

    formik.setValues(nextState);
    setParentValues(nextState);
  }

  render() {
    const { t, formik } = this.props;
    const { household } = formik.values;

    return (
      <ReviewSubSection title={t('review.sections.household')} onUpdate={this.props.handleUpdate}>
        {({ editing }) => {
          return (
            <ReviewTableCollection fallback={t('household.memberDetails.none')}>
              {
                getOtherMembers(household).map((member, index) => {
                  const memberIndex = index + 1;
                  const tableTitle = `${t('household.memberNames.person')} ${memberIndex}`;

                  return (
                    <ReviewTable
                      key={`review.household.${index}`}
                      editing={editing}
                      primaryData={this.getMemberData(member, memberIndex)}
                    >
                      <Header title={tableTitle} editing={editing}>
                        <HeaderAction
                          text={t('general.delete')}
                          onClick={() => this.handleRemoveMember(memberIndex)}
                          className="margin-right-0"
                          link
                        />
                      </Header>
                    </ReviewTable>
                  )
                })
              }
              <Button
                disabled={!isAffirmative(editing)}
                type="button"
                onClick={this.handleAddMember}
              >
                { t('review.addMember') }
              </Button>
            </ReviewTableCollection>
          );
        }}
      </ReviewSubSection>
    );
  }
}

export default withUpdateable(withLocale(HouseholdReview));
