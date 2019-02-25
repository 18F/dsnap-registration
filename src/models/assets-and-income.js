import jobs from './jobs';
import incomeSources from './income-sources';

export const hasIncome = income => income.hasIncome;

export default () => ({
  moneyOnHand: '',
  hasIncome: false,
  incomeSources: incomeSources(),
  jobs: jobs(),
});
