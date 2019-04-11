import axios from 'axios';
import { toRulesServiceFormat } from 'utils/json-transform';

const endpoint = '';
const location = process.env.NODE_ENV === 'development' ?
  'http://localhost:8000' : 'https://dsnap-rules-staging.app.cloud.gov';

export const createEligibility = (data) => {
  const transformedData = toRulesServiceFormat(data);

  return axios.post(`${location}/${endpoint}`, transformedData)
    .then(response => response.data);
};