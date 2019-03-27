import basicInfo from './basic-info';
import household from './household';
import impact from './impact';
import submit from './submit';
import errors from './error';
import config from './config';

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
  household,
  impact,
  resources,
  submit,
  errors,
  config,
});

export default state;
