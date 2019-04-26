import assets from './assets-and-income';
import { isAffirmative } from 'utils';

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
    ethnicity: '',
    hasFoodAssistance: false,
    hasOtherJobs: null,
    hasJobs: false,
    assetsAndIncome: assets(),
  };
};

export const getFirstName = person => person.name.firstName;
export const getMiddleName = person => person.name.middleName;
export const getLastName = person => person.name.lastName;
export const getDOB = person => `${person.dob.month}/${person.dob.day}/${person.dob.year}`;
export const getFullName = (person) =>
  `${getFirstName(person)} ${getMiddleName(person) || ''} ${getLastName(person)}`;
export const getIncome = person => person.assetsAndIncome;
export const getJobs = person => getIncome(person).jobs;
export const hasJob = person => isAffirmative(person.hasJobs);
export const hasOtherJobs = person => isAffirmative(person.hasOtherJobs);
export const getSSN = person => person.ssn;

export const methods = {
  getFirstName,
  getMiddleName,
  getLastName,
  getDOB,
  getFullName,
  getIncome,
  getJobs,
  hasJob,
  hasOtherJobs,
  getSSN,
}
