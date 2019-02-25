import assets from './assets-and-income';

export default () => {
  return {
    name: {
      firstName: '',
      middleName: '',
      lastName: ''
    },
    dob: {
      month: '',
      day: '',
      year: ''
    },
    sex: '',
    ssn: '',
    race: '',
    hasFoodAssistance: false,
    hasOtherJobs: false,
    hasJobs: false,
    assetsAndIncome: assets(),
  };
};

export const getFirstName = person => person.name.firstName;
export const getLastName = person => person.name.lastName;
export const getIncome = person => person.assetsAndIncome;
export const hasJob = person => person.hasJobs;
export const hasOtherJobs = person => person.hasOtherJobs;