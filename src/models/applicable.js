const applicable = (applicable = false, value = '') => ({
  applicable,
  value,
});

export const getApplicablesTotal = applicables =>
  applicables
    .filter(([_, item]) => item.applicable || Number(item.value))
    .reduce((memo, [_, item]) => memo += Number(item.value), 0)

export default applicable;
