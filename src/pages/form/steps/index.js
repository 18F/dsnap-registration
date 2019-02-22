import BasicInfo from './basic-info';
import PersonalInfo from './identity';
import Household from './household';
import AdverseEffects from './impact';

export default {
  BasicInfo,
  Identity: { PersonalInfo },
  Household,
  Impact: { AdverseEffects },
};
