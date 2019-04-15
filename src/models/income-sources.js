import applicable, { getApplicablesTotal } from './applicable';

const incomeTypes = [
  "selfEmployed",
  "unemployment",
  "cashAssistance",
  "disability",
  "socialSecurity",
  "veteransBenefits",
  "alimony",
  "childSupport",
  "otherSources",
];

export const getIncomeTotal = sources => getApplicablesTotal(sources);

export default () => ({
  ...incomeTypes.reduce((memo, type) => ({ ...memo, [type]: applicable(),  }), {}),
});
