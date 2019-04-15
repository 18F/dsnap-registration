import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray, yupToFormErrors } from 'formik';
import withUpdateable from 'components/with-updateable';
import withLocale from 'components/with-locale';
import FormikField from 'components/formik-field';
import YesNoField from 'components/yes-no-field';
import CurrencyInput from 'components/currency-input';
import ReviewSubSection from 'components/review-subsection';
import ReviewTableCollection from 'components/review-table-collection';
import ReviewTable, { Header, HeaderAction} from 'components/review-table';
import Button from 'components/button';
import { isAffirmative } from 'utils';
import job, { isGovernmentAgency } from 'models/job';
import { getIncomeTotal } from 'models/income-sources';
import { getMembers, updateMemberAtIndex } from 'models/household';
import { getFirstName, getLastName, getJobs, getIncome } from 'models/person';
import { incomeReviewValidator } from 'schemas/snapshot-review/income';

class IncomeSourcesReviewForm extends React.Component {
  static propTypes = {
    memberIndex: PropTypes.number,
    incomeSources: PropTypes.object,
    handleChange: PropTypes.func,
    t: PropTypes.func,
  }

  updateMask = (name, value) => {
    this.props.handleChange(name)(value);
  }

  render() {
    const { incomeSources, memberIndex, t } = this.props;
    const prefix = 'resources.assetsAndIncome.income';

    return (
      <div className="margin-bottom-2">
        {
          Object.keys(incomeSources).map((key, index) => (
            <CurrencyInput
              key={`${memberIndex}.${key}.${index}`}
              className="grid-col-6"
              labelText={t(`${prefix}.${key}`)}
              name={`household.members.${memberIndex}.assetsAndIncome.incomeSources.${key}.value`}
              onChange={this.updateMask}
            />
          ))
        }
      </div>
    );
  }
}

class JobsReviewForm extends React.Component {
  static propTypes = {
    handleRemoveJob: PropTypes.func,
    header: PropTypes.string.isRequired,
    memberIndex: PropTypes.number,
    jobIndex: PropTypes.number,
    t: PropTypes.func
  }

  updateMask = (name, value) => {
    this.props.handleChange(name)(value);
  }

  render() {
    const { t, memberIndex, jobIndex } = this.props;

    return (
      <div className="margin-bottom-2">
        <Header title={this.props.header}>
          <HeaderAction
            text={t('general.delete')}
            onClick={this.props.handleRemoveJob}
            className="margin-right-0"
            link
          />
        </Header>
        <FormikField
        labelText={t('resources.jobs.employerName.id')}
        name={`household.members.${memberIndex}.assetsAndIncome.jobs.${jobIndex}.employerName`}
        />
        <CurrencyInput
          labelText={t('resources.jobs.pay.id')}
          onChange={this.updateMask}
          name={`household.members.${memberIndex}.assetsAndIncome.jobs.${jobIndex}.pay`}
        />
        <YesNoField
          labelText={t('resources.jobs.stateAgency.label')}
          name={`household.members.${memberIndex}.assetsAndIncome.jobs.${jobIndex}.isDsnapAgency`}
        />
      </div>
    )
  }
}

class IncomeReviewSection extends React.Component {
  static propTypes = {
    values: PropTypes.object,
    handleChange: PropTypes.func
  }

  getJobData(memberIndex, jobIndex, job) {
    const { t } = this.props;
    const prefix = 'resources.jobs';

    return [
      {
        name: t(`${prefix}.employerName.id`),
        data: job.employerName,
      },
      {
        name: t(`${prefix}.pay.id`),
        data: job.pay,
      },
      {
        name: t(`${prefix}.stateAgency.id`),
        data: isGovernmentAgency(job),
      }
    ]
  }

  getPrimaryIncomeData(income) {
    const { t } = this.props;

    return [
      {
        name: t('resources.assetsAndIncome.incomeSources.total'),
        data: `$${getIncomeTotal(Object.entries(income.incomeSources))}`,
      }
    ]
  }

  getSecondaryIncomeData(income) {
    const { t } = this.props;
    const { incomeSources } = income;
    const prefix = 'resources.assetsAndIncome.income';

    return Object.entries(incomeSources).map(([key, _]) => {
      return {
        name: t(`${prefix}.${key}`),
        data: `$${incomeSources[key].value || 0}`,
      }
    });
  }

  handleRemoveJob = (memberIndex, job, member) => {    
    const { household } = this.props.formik.values;

    const nextMember = {
      ...member,
      assetsAndIncome: {
        ...member.assetsAndIncome,
        jobs: member.assetsAndIncome.jobs.filter(j => j !== job)
      }
    };
    const nextHousehold = updateMemberAtIndex(household, memberIndex, nextMember);

    this.props.formik.setValues({
      ...this.props.formik.values,
      household: nextHousehold
    });
  }

  handleAddJob = (memberIndex, member) => {
    const { household } = this.props.formik.values;
    const nextMember = {
      ...member,
      assetsAndIncome: {
        ...member.assetsAndIncome,
        jobs: getJobs(member).concat([job()])
      }
    };

    const nextHousehold = updateMemberAtIndex(household, memberIndex, nextMember);

    this.props.formik.setValues({
      ...this.props.formik.values,
      household: nextHousehold
    });
  }

  handleToggleEdit = (isEditing) => {
    if (isEditing) {
      this.props.onEdit(this.validateSection);
    }
  }

  validateSection = () => {
    const { values } = this.props.formik;
    const errors = incomeReviewValidator(values);

    if (!Object.keys(errors).length) {
      return errors;
    }

    return yupToFormErrors(errors);
  }

  render() {
    const { t, formik, handleUpdate } = this.props;

    return (
      <FieldArray
        name="household.members"
        render={() => {
          return (
            getMembers(formik.values.household).map((member, memberIndex) => {
              const firstName = getFirstName(member);
              const lastName = getLastName(member);
              const title = t('review.sections.income', {
                firstName
              });
              const income = getIncome(member);
              const jobs = getJobs(member);
      
              return (
                <ReviewSubSection
                  title={title}
                  onUpdate={handleUpdate}
                  onEdit={this.handleToggleEdit}
                  key={`income.${firstName}.${lastName}.${memberIndex}`}
                  readonly={this.props.readonly}
                >
                  {({ editing }) => (
                    <React.Fragment>
                      <ReviewTableCollection fallback={t('resources.jobs.none')}>
                        {
                          jobs.map((job, jobIndex) => {
                            const tableHeader = `${t('resources.jobs.id')} ${jobIndex + 1}`;
                            const key = `income.${firstName}.${memberIndex}.${jobIndex}`;

                            if (editing) {
                              return (
                                <JobsReviewForm
                                  memberIndex={memberIndex}
                                  jobIndex={jobIndex}
                                  t={t}
                                  handleChange={this.props.handleChange}
                                  handleRemoveJob={this.handleRemoveJob}
                                  header={tableHeader}
                                  key={key}
                                />
                              );
                            }

                            return (
                              <ReviewTable
                                key={key}
                                primaryData={this.getJobData(memberIndex, jobIndex, job)}
                              />
                            );
                          })
                        }
                      </ReviewTableCollection>
                      <Button
                        disabled={!isAffirmative(editing)}
                        type="button"
                        onClick={() => this.handleAddJob(memberIndex, member)}
                        className="margin-y-4"
                      >
                        { t('review.addJob') }
                      </Button>
                      {
                        editing ?
                        <IncomeSourcesReviewForm
                          handleChange={this.props.handleChange}
                          t={t}
                          memberIndex={memberIndex}
                          incomeSources={income.incomeSources}
                        /> :
                        <ReviewTable
                          editing={editing}
                          primaryData={this.getPrimaryIncomeData(income)}
                          secondaryData={this.getSecondaryIncomeData(income)}
                        >
                          <Header title={t('resources.assetsAndIncome.incomeSources.id')} />
                        </ReviewTable>
                      }
                    </React.Fragment>
                  )}
                </ReviewSubSection>
              );
            })
          );
        }}
      />
    );
  }
}

export default withUpdateable(withLocale(IncomeReviewSection));
