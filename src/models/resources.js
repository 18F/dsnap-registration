const resources = () => ({
  membersWithIncome: [],
  currentMemberIndex: 0,
});

export const countMembersWithIncome = resources =>
  resources.membersWithIncome.length;

export const updateCurrentMemberIndex = (resources, amount) => {
  const nextIndex = resources.currentMemberIndex + amount;

  return nextIndex >= countMembersWithIncome(resources) ?
    resources.currentMemberIndex : nextIndex;
};

export const pendingMembersWithResources = resources =>
  resources.currentMemberIndex < countMembersWithIncome(resources) - 1;

export const getCurrentResourceHolderId = resources => {
  return resources.membersWithIncome[resources.currentMemberIndex];
};

export default resources;
