export const getDisaster = (disasters, index) => disasters.data[index] || {};
export const getDisasters = disasters => disasters.data;
export const getCounties = (disasters, index, periodIndex) => {
  const benefitsPeriod = getDisaster(disasters, index).application_periods;
  let defaultValue = []

  if (!benefitsPeriod.length) {
    return defaultValue;
  }

  const applicationPeriodData = benefitsPeriod[periodIndex];

  return (applicationPeriodData && applicationPeriodData.counties) || defaultValue;
};

export default () => ({
  data: []
});
