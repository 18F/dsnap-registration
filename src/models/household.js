import person from './person';

export default () => ({
  // refers to number of additional members of a given household,
  // beyond the primary applicant
  numMembers: 0,
  currentMemberIndex: 0,
  members: [ person() ],
});


export const getHouseholdCount = household => household.members.length;
export const getMembers = household => household.members;
// TODO: there is probably an opportunity to make a service that connects
// basic info and household so this accessor doesnt have to be hardcoded
export const getApplicant = household => getMembers(household)[0];
export const getCurrentMemberIndex = ({ currentMemberIndex }) =>
  typeof currentMemberIndex !== 'number' ? 0 : currentMemberIndex;

export const hasAdditionalMembers = household =>
  household.currentMemberIndex < getHouseholdCount(household) - 1;

export const addPeopleToHousehold = (household, count) => {
  const { members, ...rest } = household;

  return {
    ...rest,
    members: [
      ...members,
      ...Array.apply(null, {
        length: count
      }).map(person)
    ]
  };
};

export const updateMemberAtIndex = (household, index, member) => {
  const nextMembers = household.members.slice(0);
  nextMembers.splice(index, 1, member);

  return {
    ...household,
    members: nextMembers
  }
};

export const updateCurrentMemberIndex = (household, index) => ({
  ...household,
  currentMemberIndex: index >= getHouseholdCount(household) ? getHouseholdCount(household) - 1 : index
});
