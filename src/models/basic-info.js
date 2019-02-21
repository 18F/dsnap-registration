import address from './address';

export const getCustomerFirstName = info => info.applicantName.firstName;

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
