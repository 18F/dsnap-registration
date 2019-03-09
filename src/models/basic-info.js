import address from './address';

export default () => ({
  personId: 0,
  disasterIndex: '',
  disasterCounty: '',
  phone: '',
  email: '',
  residenceAddress: address(),
  mailingAddress: address(),
  county: '',
  currentMailingAddress: false
});

export const hasMailingAddress = info => info.currentMailingAddress !== 'true';
