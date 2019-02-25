import jobs from './jobs';
import otherIncome from './other-income';

export default () => ({
  moneyOnHand: '',
  hasIncome: false,
  otherIncome: otherIncome(),
  jobs: jobs(),
});
