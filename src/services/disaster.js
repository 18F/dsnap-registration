import axios from 'axios';

const endpoint = 'disasters';
const location = process.env.NODE_ENV === 'development' ?
  'http://localhost:8000' : '';

export const getDisasters = () =>
  axios.get(`${location}/${endpoint}`)
    .then(response => response.data)