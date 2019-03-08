import address from './address';

export default () => ({
  personId: 0,
  disasterIndex: null,
  phone: '',
  email: '',
  residenceAddress: address(),
  mailingAddress: address(),
  county: '',
  currentMailingAddress: false
});

export const hasMailingAddress = info => info.currentMailingAddress !== 'true';
