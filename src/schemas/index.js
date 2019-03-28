import * as Yup from 'yup';
import { t } from 'i18next';

const buildYupType = (type) => Yup[type].call();

export const shapeOf = shape => buildYupType('object').shape(shape);

export const arrayOf = shape => buildYupType('array').of(shape);

export const string = () => buildYupType('string');

export const bool = () => buildYupType('boolean');

export const buildSchema = exec => {
  return exec({ Yup, t });
};
