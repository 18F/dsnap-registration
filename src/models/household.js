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
export const getApplicant = household => getMemberAtIndex(household, 0);

export const getMemberAtIndex = (household, index) => getMembers(household)[index];

export const getCurrentMemberIndex = (household) => {
  const i = household.currentMemberIndex;
  let next = i;

  if (next < 0) {
    next = 0;
  } else if (next === 0) {
    next += 1; 
  } else if (i >= getOtherMemberCount(household)) {
    next = getOtherMemberCount(household);
  }

  return next;
}

export const updateCurrentMemberIndex = household => {
  const nextHousehold = {
    ...household,
    currentMemberIndex: household.currentMemberIndex >= getOtherMemberCount(household) ?
      getOtherMemberCount(household) : household.currentMemberIndex + 1
  };
 
  return nextHousehold;
};

export const decrementMemberIndex = ({ currentMemberIndex }) => {
  return currentMemberIndex - 1 <= 0 ? 0 : currentMemberIndex - 1;
};

export const hasAdditionalMembers = household => {
  return household.currentMemberIndex < getOtherMemberCount(household);
};

export const updateHouseholdMembers = (household, count) => {
  const currentMemberCount = getOtherMemberCount(household);
  let updatedHousehold;

  if (count === currentMemberCount || count < 0) {
    updatedHousehold = { ...household, currentMemberIndex: 0 };
  } else if (count < currentMemberCount) {
    updatedHousehold = {
      ...household,
      currentMemberIndex: 0,
      members: household.members.slice(0, count + 1),
    };
  } else if (count > currentMemberCount) {
    updatedHousehold = {
      ...household,
      currentMemberIndex: 0,
      members: [
        ...household.members,
        ...Array.apply(null, {
          length: count - currentMemberCount
        }).map(person)
      ]
    };
  }

  return updatedHousehold;
};

export const addPeopleToHousehold = (household, count) => {
  const { members, ...rest } = household;

  if (!count || count < 0) {
    return household;
  }

  const next = {
    ...rest,
    members: [
      ...members,
      ...Array.apply(null, {
        length: count
      }).map(person)
    ]
  };

  return next;
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

export const methods = {
  updateMemberAtIndex,
  deleteMemberFromHousehold,
  addPeopleToHousehold,
  updateHouseholdMembers,
  getHouseholdCount,
  getMembers,
  getOtherMembers,
  getOtherMemberCount,
  getApplicant,
  getCurrentMemberIndex,
  updateCurrentMemberIndex,
  decrementMemberIndex,
  hasAdditionalMembers,
  getMemberAtIndex,
};
