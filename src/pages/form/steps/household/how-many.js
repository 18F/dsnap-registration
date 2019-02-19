import React from 'react';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import { buildNestedKey } from 'utils';

const modelName = 'count';

const HowMany = ({ handleChange, sectionName, t, registerStep })=>
  <Wizard.Step
    header={t(`${buildNestedKey(sectionName, modelName, 'header')}`)}
    modelName={modelName}
    registerStep={registerStep}
  >
    household count page
  </Wizard.Step>

export default withLocale(HowMany);
