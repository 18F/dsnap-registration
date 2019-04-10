import axios from 'axios';
import { toRegistrationServiceFormat, fromRegistrationServiceFormat } from 'utils/json-transform';

const endpoint = 'registrations';
const location = process.env.NODE_ENV === 'development' ?
  'http://localhost:8001' : 'https://dsnap-registration-service-staging.app.cloud.gov';


const formatDate = date =>
  !Object.values(date).every(v => !!v) ?
  '' :
  `${date.day}-${date.month}-${date.year}`;

export const getRegistrations = ({ registrant_dob, registrant_ssn, ...rest}) => {
  const transformedFilters = {
    ...rest,
    registrant_dob: formatDate(registrant_dob),
    registrant_ssn: '111111111'//registrant_ssn.replace(/[^0-9A]/g, '')
  };

  const formattedFilters = Object.entries(transformedFilters)
    .reduce((accum, [key, value]) => {
      if (!value) {
        return accum;
      }

      return [
        ...accum,
        `${key}=${value}`,
      ];
    }, []).join('&');

  return axios.get(`${location}/${endpoint}?${formattedFilters}`)
    .then((response) => {
      return response.data.map(({ latest_data }) => {
        return fromRegistrationServiceFormat(latest_data);
      });
    });
};

export const createRegistration = (registrationData) => {
  const transformedData = toRegistrationServiceFormat(registrationData);

  return axios.post(`${location}/${endpoint}`, transformedData)
    .then(response => response.data);
};
