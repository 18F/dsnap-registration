import basicInfo from './basic-info';
import identity from './identity';
import household from './household';
import impact from './impact';

const resources = () => ({
  membersWithIncome: [],
  currentMemberIndex: null
});

const combine = (obj) =>
  Object.entries(obj).reduce((accum, [ name, statefn ]) => (
    {
      ...accum,
      [name]: statefn(),
    }
  ), {});

const state = combine({
  basicInfo,
  identity,
  household,
  impact,
  resources,
});

export default state;
