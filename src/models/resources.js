const resources = () => ({
  membersWithIncome: [],
  currentMemberIndex: 0,
});

export const countMembersWithIncome = resources =>
  resources.membersWithIncome.length;

export const updateCurrentMemberIndex = (resources, amount) => {
  const nextIndex = resources.currentMemberIndex + amount;

  return nextIndex;
};

export const pendingMembersWithResources = resources =>
  resources.currentMemberIndex <= (countMembersWithIncome(resources) - 1);

export const getCurrentResourceHolderId = resources => {
  const { currentMemberIndex } = resources;
  const membersLength = countMembersWithIncome(resources);
  const clampedIndex = currentMemberIndex >= membersLength ? membersLength - 1 : currentMemberIndex;

  return resources.membersWithIncome[clampedIndex];
};

export default resources;
