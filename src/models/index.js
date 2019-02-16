import basicInfo from './basic-info';
import identity from './identity';
import household from './household';

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
});

export default state;
