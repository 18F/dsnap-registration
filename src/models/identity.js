export default () => ({
  personalInfo: {
    stateId: '',
  },
});

export const getID = identity => identity.personalInfo.stateId;
