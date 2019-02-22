import address from './address';

export default () => ({
  name: {
    firstName: '',
    middleName: '',
    lastName: '',
  },
  phone: '',
  email: '',
  residenceAddress: address(),
  mailingAddress: address(),
  county: '',
  currentMailingAddress: false
});
