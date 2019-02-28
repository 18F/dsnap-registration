import BasicInfo from './basic-info';
import PersonalInfo from './identity';
import Household from './household';
import AdverseEffects from './impact';
import Resources from './resources';
import Review from './review';

export default {
  BasicInfo,
  Identity: { PersonalInfo },
  Household,
  Impact: { AdverseEffects },
  Resources,
  Review: { Review },
};
