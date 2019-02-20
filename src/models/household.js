import person from './person';

export default () => ({
  numMembers: '',
  currentMemberIndex: 0,
  members: [],
});

export const getHouseholdCount = (household) => household.numMembers;
export const getMembers = (household) => household.members;
export const getCurrentMemberIndex = ({ currentMemberIndex }) =>
  typeof currentMemberIndex !== 'number' ? 0 : currentMemberIndex;

export const hasAdditionalMembers = household =>
  household.currentMemberIndex <= household.members.length - 1;

export const addPeopleToHousehold = (household, count) => ({
  ...household,
  members: Array.apply(null, { length: count }).map(person),
});

export const updateCurrentMemberIndex = (household, currentMemberIndex) => ({
  ...household,
  currentMemberIndex
});
