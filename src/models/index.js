import basicInfo from './basic-info';
import household from './household';
import impact from './impact';
import submit from './submit';
import errors from './error';
import config from './config';
import resources from './resources';

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
