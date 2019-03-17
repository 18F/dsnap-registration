import applicable from './applicable';
import { isAffirmative } from 'utils';

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
  Object.entries(impact.otherExpenses)
    .filter(([_, expense]) => expense.applicable)
    .reduce((memo, [_, expense]) => memo += Number(expense.value), 0)


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
