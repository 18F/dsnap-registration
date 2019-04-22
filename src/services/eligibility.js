import axios from 'axios';
import { toRulesServiceFormat } from 'utils/json-transform';

const endpoint = '';
const location = process.env.NODE_ENV === 'development' ?
  'http://localhost:8000' : process.env.REACT_APP_RULES_SERVICE_URL;

export const createEligibility = (data) => {
  const transformedData = toRulesServiceFormat(data);

  return axios.post(`${location}/${endpoint}`, transformedData, {
    headers: {
      'Authorization': `Basic ${btoa('admin:9NWwq9bA')}`
    }
  })
    .then(response => response.data);
};