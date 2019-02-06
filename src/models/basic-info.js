import address from './address';

export default () => ({ 
  applicantName: {
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
