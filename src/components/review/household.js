import React from 'react';
import PropTypes from 'prop-types';
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
import DateInput from 'components/date-input';
import NameFields from 'components/name-input';

class HouseholdMemberReviewForm extends React.Component {
  static propTypes = {
    member: PropTypes.object,
    memberIndex: PropTypes.string,
    t: PropTypes.func,
  }

  updateMask = (name, data) => {
    this.props.handleChange(name)(data);
  };

  removeMember = () => {
    this.props.onRemove(this.props.memberIndex);
  }

  render() {
    const { member, memberIndex, t } = this.props;

    return (
      <div className="margin-bottom-2">
        <Header title={this.props.header}>
          <HeaderAction
            text={t('general.delete')}
            onClick={this.removeMember}
            className="margin-right-0"
            link
          />
        </Header>
        <NameFields memberIndex={memberIndex} />
        <DateInput memberIndex={memberIndex} />
        <FormikField
          type="mask"
          pattern="XXX-XX-XXXX"
          delimiter="-"
          name={`household.members.${memberIndex}.ssn`}
          onChange={this.updateMask}
          labelText={t('household.memberDetails.ssn.label', { firstName: getFirstName(member) })}
        />
      </div>
    );
  }
}

class HouseholdReview extends React.Component {
  getMemberData(member) {
    const { t } = this.props;

    return [
      {
        name: t('basicInfo.name.id'),
        data: getFullName(member),
      },
      {
        name: t('identity.personalInfo.dob.id'),
        data: getDOB(member),
      },
      {
        name: t('identity.personalInfo.ssn.id'),
        data: member.ssn,
      },
    ];
  }

  handleRemoveMember = (index) => {
    const { formik } = this.props;
    const { household } = formik.values;
    const nextHousehold = deleteMemberFromHousehold(household, index);
    const nextState = {
      ...formik.values,
      household: nextHousehold
    };

    formik.setValues(nextState);
  }

  handleAddMember = () => {
    const { formik } = this.props;
    const { values } = formik;
    const nextState = {
      ...values,
      household: addPeopleToHousehold(values.household, 1),
    };

    formik.setValues(nextState);
  }

  render() {
    const { t, formik } = this.props;
    const { household } = formik.values;

    return (
      <ReviewSubSection
        title={this.props.title}
        onUpdate={this.props.handleUpdate}
        onEdit={this.handleToggleEdit}
      >
        {({ editing }) => {
          return (
            <ReviewTableCollection fallback={t('household.memberDetails.none')}>
              {
                getOtherMembers(household).map((member, index) => {
                  const memberIndex = index + 1;
                  const header = `${t('household.memberNames.person')} ${memberIndex}`;

                  return (
                    editing ?
                    <HouseholdMemberReviewForm
                      t={t}
                      header={header}
                      member={member}
                      memberIndex={memberIndex}
                      onRemove={this.handleRemoveMember}
                    /> :
                    <ReviewTable
                      key={`review.household.${index}`}
                      editing={editing}
                      primaryData={this.getMemberData(member)}
                    />
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
