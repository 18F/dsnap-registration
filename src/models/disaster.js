import moment from 'moment';

export const getDisaster = (disasters, index) => disasters.data[index] || {};
export const getState = disaster => disaster.state;
export const getDisasters = disasters => Object.values(disasters.data);
export const getBeginDate = disaster => moment(disaster.benefit_begin_date).format('MM/DD/YYYY');
export const getEndDate = disaster => moment(disaster.benefit_end_date).format('MM/DD/YYYY');
export const getCounties = (disasters, index, periodIndex) => {
  const benefitsPeriod = getDisaster(disasters, index).application_periods;
  let defaultValue = []

  if (!benefitsPeriod || !benefitsPeriod.length) {
    return defaultValue;
  }

  const applicationPeriodData = benefitsPeriod[periodIndex];

  return (applicationPeriodData && applicationPeriodData.counties) || defaultValue;
};
export const getStateForDisaster = disaster => disaster.state;

export default () => ({
  data: []
});
