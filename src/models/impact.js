const applicable = (applicable = false, value = null) => ({
  applicable,
  value,
});

const baseData = {
  lostOrInaccessibleIncome: '',
  inaccessibleMoney: '',
  buyFood: '',
};

const applicableData = [
  'repairs', 'tempShelter', 'evacuation', 'foodLoss',
  'propertyProtection', 'medicalPersonalInjury', 'funeral',
  'petBoarding', 'itemReplacement', 'heatingFuel', 'cleaningItems',
  'vehicleDamage', 'storage',
];

export default () => ({
  ...baseData,
  ...applicableData.reduce((memo, type) => ({ [type]: applicable(), ...memo }), {}),
});
