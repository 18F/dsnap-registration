import person from './person';

export default () => ({
  numMembers: 1,
  currentMemberIndex: 0,
  members: [ person() ],
});

export const getHouseholdCount = (household) => household.numMembers;
export const getMembers = (household) => household.members;
export const getCurrentMemberIndex = ({ currentMemberIndex }) =>
  typeof currentMemberIndex !== 'number' ? 0 : currentMemberIndex;

export const hasAdditionalMembers = household =>
  household.currentMemberIndex < household.members.length - 1;

export const addPeopleToHousehold = (household, count, data = {}) => ({
  ...household,
  members: Array.apply(null, {
    length: count
  }).map(() => ({ ...person(), ...data })),
});

export const updateCurrentMemberIndex = (household, index) => ({
  ...household,
  currentMemberIndex: index >= household.members.length ? household.members.length - 1 : index
});
