import applicable from './applicable';
import { isAffirmative } from 'utils';
import { getApplicablesTotal } from './applicable';

const baseData = {
  lostOrInaccessibleIncome: undefined,
  inaccessibleMoney: '',
  buyFood: '',
  noOtherExpenses: false
};

const applicableData = [
  'repairs', 'tempShelter', 'evacuation', 'foodLoss', 'other'
];

export const getExpenseTotal = (impact) =>
  getApplicablesTotal(Object.entries(impact.otherExpenses))

export const getLostFood = impact => isAffirmative(impact.buyFood);
export const getLostIncome = impact => isAffirmative(impact.lostOrInaccessibleIncome);
export const getLostMoney = impact => isAffirmative(impact.inaccessibleMoney);
export const getExpense = (impact, expense) => impact.otherExpenses[expense] || applicable();
export const getExpenses = impact => impact.otherExpenses;

export default () => ({
  ...baseData,
  otherExpenses: {
    ...applicableData.reduce((memo, type) => ({ [type]: applicable(), ...memo }), {}),
  },
});
