export const getDisaster = (disasters, index) => disasters.data[index] || {};
export const getDisasters = disasters => Object.values(disasters.data);
export const getBeginDate = disaster => disaster.benefit_begin_date;
export const getCounties = (disasters, index, periodIndex) => {
  debugger
  const benefitsPeriod = getDisaster(disasters, index).application_periods;
  let defaultValue = []

  if (!benefitsPeriod || !benefitsPeriod.length) {
    return defaultValue;
  }

  const applicationPeriodData = benefitsPeriod[periodIndex];

  return (applicationPeriodData && applicationPeriodData.counties) || defaultValue;
};

export default () => ({
  data: []
});
