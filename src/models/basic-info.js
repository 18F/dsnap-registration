import address from './address';

export default () => ({
  personId: 0,
  disasterIndex: '',
  disasterCounty: '',
  phone: '',
  email: '',
  residenceAddress: address(),
  mailingAddress: address(),
  currentMailingAddress: null,
  stateId: ''
});

export const getID = info => info.stateId;
export const hasMailingAddress = info => info.currentMailingAddress !== 'true';
export const getAddress = address => [
  address.street1,
  address.street2,
  `${address.city}, ${address.state}, ${address.zip}`
];
export const getMailingAddress = info =>
  info.currentMailingAddress ? false : getAddress(info.mailingAddress);
export const getResidenceAddress = info => getAddress(info.residenceAddress);
