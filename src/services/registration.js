import axios from 'axios';
import toRegistrationServiceFormat from 'utils/json-transform';

const endpoint = 'registrations';
const location = process.env.NODE_ENV === 'development' ?
  'http://localhost:8001' : 'https://dsnap-rules-staging.app.cloud.gov';

export const createRegistration = (registrationData) => {
  const transformedData = toRegistrationServiceFormat(registrationData);

  return axios.post(`${location}/${endpoint}`, transformedData)
    .then(response => response.data)
};
