import applicable from './applicable';

const baseData = {
  lostOrInaccessibleIncome: '',
  inaccessibleMoney: '',
  buyFood: '',
  noOtherExpenses: false
};

const applicableData = [
  'repairs', 'tempShelter', 'evacuation', 'foodLoss',
  'propertyProtection', 'medical', 'funeral',
  'petBoarding', 'itemReplacement', 'heatingFuel', 'cleanup',
  'vehicleDamage', 'storage', 
];

export default () => ({
  ...baseData,
  otherExpenses: {
    ...applicableData.reduce((memo, type) => ({ [type]: applicable(), ...memo }), {}),
  },
});
