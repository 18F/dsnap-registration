import person from './person';

export default () => ({
  // refers to number of additional members of a given household,
  // beyond the primary applicant
  numMembers: 0,
  currentMemberIndex: 0,
  members: [ person() ],
});


// @return absolute number of members in a household, including the primary applicant
export const getHouseholdCount = household => getMembers(household).length;

// @return all members of household
export const getMembers = household => household.members || [];

export const getOtherMembers = household => getMembers(household).slice(1);

export const getOtherMemberCount = household => getOtherMembers(household).length;

// TODO: there is probably an opportunity to make a service that connects
// basic info and household so this accessor doesnt have to be hardcoded
// @return the applicant, who is always the first entry in the members array
export const getApplicant = household => getMembers(household)[0];
export const getCurrentMemberIndex = ({ currentMemberIndex }) =>
  currentMemberIndex === 0 ? currentMemberIndex + 1 : 0;

export const updateCurrentMemberIndex = household => ({
  ...household,
  currentMemberIndex: hasAdditionalMembers(household) ? household.currentMemberIndex + 1 : 0, 
});

export const hasAdditionalMembers = household =>
  getCurrentMemberIndex(household) < getOtherMembers(household);

export const addPeopleToHousehold = (household, count) => {
  const { members, ...rest } = household;

  if (getOtherMemberCount(household) >= count || !count || count < 0) {
    return household;
  }

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

export const deleteMemberFromHousehold = (household, index) => {
  getMembers(household).splice(index, 1);

  return {
    ...household
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
