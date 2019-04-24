import { methods as memberMethods } from 'models/person';

export const memberJobs = {
  updateCurrentJobForMember(currentMemberId, members, nextJobIndex) {
    const member = members[currentMemberId];
    const income = memberMethods.getIncome(member);

    return {
      ...member,
      assetsAndIncome: {
        ...income,
        currentJobIndex: nextJobIndex,
      }
    };
  },

  incrementJobIndexForMember(currentMemberId, members) {
    const member = members[currentMemberId];
    const income = memberMethods.getIncome(member);

    return {
      ...member,
      assetsAndIncome: {
        ...income,
        currentJobIndex: income.currentJobIndex + 1,
      }
    };
  }
};
