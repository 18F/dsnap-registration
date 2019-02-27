import React from 'react';
import PropTypes from 'prop-types';
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
import job from 'models/job';
import { getMembers, updateMemberAtIndex } from 'models/household';
import { getFirstName, getJobs, getIncome } from 'models/person';

class IncomeReviewSection extends React.Component {
  static propTypes = {
    values: PropTypes.object,
    handleChange: PropTypes.func
  }

  getJobData(memberIndex, jobIndex, job) {
    const { t, handleChange } = this.props;
    const prefix = 'resources.jobs';

    return [
      {
        name: t(`${prefix}.employerName.id`),
        data: job.employerName,
        component: {
          props: {
            labelText: t(`${prefix}.employerName.id`),
            onChange: handleChange,
            name: `household.members.${memberIndex}.assetsAndIncome.jobs.${jobIndex}.employerName`
          },
          Component: FormikField
        },
      },
      {
        name: t(`${prefix}.pay.id`),
        data: job.pay,
        component: {
          props: {
            labelText: t(`${prefix}.pay.id`),
            onChange: handleChange,
            name: `household.members.${memberIndex}.assetsAndIncome.jobs.${jobIndex}.pay`
          },
          Component: FormikField
        }
      },
      {
        name: t(`${prefix}.stateAgency.id`),
        data: job.isStateAgency,
        component: {
          props: {
            labelText: t(`${prefix}.stateAgency.label`),
            name: `household.members.${memberIndex}.assetsAndIncome.jobs.${jobIndex}.isStateAgency`,
            onChange: handleChange,
          },
          Component: YesNoField
        }
      }
    ]
  }

  getPrimaryIncomeData(income) {
    const { t } = this.props;
    return [
      {
        name: t('resources.assetsAndIncome.incomeSources.total'),
        data: `$${Object.entries(income.incomeSources)
          .filter(([_, source]) => source.applicable)
          .reduce((memo, [_, source]) => memo += Number(source.value), 0)}`,
        readonly: true
      }
    ]
  }

  getSecondaryIncomeData(memberIndex, income) {
    const { t, handleChange } = this.props;
    const { incomeSources } = income;
    const prefix = 'resources.assetsAndIncome.income';

    return Object.entries(incomeSources).map(([key, _]) => {
      return {
        name: t(`${prefix}.${key}`),
        data: `$${incomeSources[key].value || 0}`,
        component: {
          props: {
            className: 'grid-col-6',
            labelText: t(`${prefix}.${key}`),
            name: `household.members.${memberIndex}.assetsAndIncome.incomeSources.${key}.value`,
            onChange: handleChange
          },
          Component: CurrencyInput
        }
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

  render() {
    const { t, formik, handleUpdate } = this.props;

    return (
      getMembers(formik.values.household).map((member, memberIndex) => {
        const firstName = getFirstName(member);
        const title = t('review.sections.income', {
          firstName
        });
        const income = getIncome(member);
        const jobs = getJobs(member);

        return (
          <ReviewSubSection title={title} onUpdate={handleUpdate} key={`${firstName}.${memberIndex}`}>
            {({ editing }) => (
              <React.Fragment>
                <ReviewTableCollection fallback={t('resources.jobs.none')}>
                  {
                    jobs.map((job, jobIndex) => {
                      const tableHeader = `${t('resources.jobs.id')} ${jobIndex + 1}`;

                      return (
                        <ReviewTable
                          key={`${memberIndex}.${jobIndex}`}
                          editing={editing}
                          primaryData={this.getJobData(memberIndex, jobIndex, job)}
                        >
                          <Header title={tableHeader} editing={editing}>
                            <HeaderAction
                              text={t('general.delete')}
                              onClick={() => this.handleRemoveJob(memberIndex, job, member)}
                              className="margin-right-0"
                              link
                            />
                          </Header>
                        </ReviewTable>
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
                <ReviewTable
                  t={t}
                  editing={editing}
                  primaryData={this.getPrimaryIncomeData(income)}
                  secondaryData={this.getSecondaryIncomeData(memberIndex, income)}
                >
                  <Header title={t('resources.assetsAndIncome.incomeSources.id')} />
                </ReviewTable>
              </React.Fragment>
            )}
          </ReviewSubSection>
        );
      })
    );
  }
}

export default withUpdateable(withLocale(IncomeReviewSection));
