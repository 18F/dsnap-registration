import job from './job';
import incomeSources from './income-sources';

export const hasIncome = income => income.hasIncome;

export const addJob = (income, data) => {
  const nextJobs = [
    ...income.jobs,
    job(data)
  ];

  return {
    ...income,
    jobs: nextJobs,
  };
}

export default () => ({
  hasIncome: false,
  incomeSources: incomeSources(),
  jobs: [],
  currentJobIndex: 0
});
