import { buildSchema, shapeOf, string } from 'schemas';

const isObject = v =>
  !!v && (typeof v === 'function' || typeof v === 'object');

const collectObjectValues = (object) => {
  return Object.values(object).reduce((accum, value) => {
    let nextVal;

    if (isObject(value)) {
      nextVal = collectObjectValues(value)
    } else {
      nextVal = [value]
    }

    return [
      ...accum,
      ...nextVal
    ]
  }, []);
}

const workerSearchSchema = buildSchema(({ t }) => {
  return shapeOf({
    dob: shapeOf({
      month: string(),
      day: string(),
      year: string()
    }),
    stateId: string(),
    ssn: string(),
    lastName: string()
  })
  .test('anyValues', t('worker.errors.search'), (values) => {
    return collectObjectValues(values).some((v) => !!v);
  })
});

export default workerSearchSchema;
