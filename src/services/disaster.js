import axios from 'axios';

const endpoint = 'disasters';
const location = process.env.NODE_ENV === 'development' ?
  'http://localhost:8000' : process.env.REACT_APP_RULES_SERVICE_URL;

  // TODO: here we should xform the data into a keyed dictionary,
  // relying on the index of an array is pretty sketchy
export const getDisasters = () =>
  axios.get(`${location}/${endpoint}`)
    .then(response => response.data)