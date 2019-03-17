import job from './job';
import incomeSources from './income-sources';

export const hasIncome = income => income.hasIncome;
export const getMoneyOnHand = income => income.moneyOnHand || 0;

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
  moneyOnHand: '',
});
