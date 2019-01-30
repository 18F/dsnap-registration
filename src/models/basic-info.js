import address from './address';

export default () => ({ 
  applicantName: {
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
});
