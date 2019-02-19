import person from './person';

export default () => ({
  numMembers: '',
  currentMemberIndex: null,
  members: [],
  hasAdditionalMembers: false,
});

export const addPeopleToHousehold = (household, { count }) => ({  
  ...household,
  members: Array.apply(null, { length: count }).map(person),
});

export const updateMemberOfHousehold = (household, { memberInfo, index }) => {
  const members = getMembers(household);
  const memberToUpdate = members[index] || person();
  const updatedMembers = [
    ...members,
    { ...memberToUpdate, ...memberInfo }
  ]

  return {
    ...household,
    members: updatedMembers,
  };
};

export const getMembers = (household) => household.members;

export const hasCompletedMemberData = (household) => {
  /**
   * for each member in household
   *    validate that all required info has been entered
   *    if not valid bail and set hasAdditionalMembers = true
   * all valid, set hasAdditionalMembers to false
   * 
   * this can maybe be a method in the view or fsm?
   * 
   * fsm will read this value and route appropriately
   */
};
