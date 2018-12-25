import address from './address';

export default { 
  name: {
    firstName: '',
    middleName: '',
    lastName: '',
  },
  dob: {
    month: '',
    day: '',
    year: '',
  },
  sex: '',
  phone: '',
  email: '',
  county: '',
  residenceAddress: address(),
  mailingAddress: address(),
  isAddressMailingAddress: true
};
