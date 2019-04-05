import axios from 'axios';
import { toRulesServiceFormat } from 'utils/json-transform';

const endpoint = '';
const location = process.env.NODE_ENV === 'development' ?
  'http://localhost:8000' : 'https://dsnap-rules-staging.app.cloud.gov';

export const createEligibility = (requestNumber, { original_data }) => {
  const transformedData = toRulesServiceFormat(requestNumber, original_data);

  return axios.post(`${location}/${endpoint}`, transformedData)
    .then(response => response.data);
};