import { setIn } from 'formik';
import { otherExpensesSchema } from 'schemas/impact';

export const disasterExpenseValidator = (values) => {
  let errors = {};
  
  try {
    otherExpensesSchema.validateSync(values)
  } catch(e) {
    errors = setIn(errors, e.path, e.message);
  }

  return errors;
};
