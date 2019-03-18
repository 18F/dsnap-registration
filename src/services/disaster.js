import axios from 'axios';

const endpoint = 'disasters';
const location = process.env.NODE_ENV === 'development' ?
  'http://localhost:8000' : 'https://dsnap-rules-staging.app.cloud.gov';

  // TODO: here we should xform the data into a keyed dictionary,
  // relying on the index of an array is pretty sketchy
export const getDisasters = () =>
  axios.get(`${location}/${endpoint}`)
    .then(response => response.data)