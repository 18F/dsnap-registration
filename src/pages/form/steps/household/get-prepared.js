import React from 'react';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import { buildNestedKey } from 'utils';

const modelName = 'getPrepared';

const GetPrepared = ({ handleChange, sectionName, t, registerStep })=>
  <Wizard.Step
    header={t(`${buildNestedKey(sectionName, modelName, 'header')}`)}
    modelName={modelName}
    registerStep={registerStep}
  >
    get prepared page. no model here!
  </Wizard.Step>

export default withLocale(GetPrepared);
