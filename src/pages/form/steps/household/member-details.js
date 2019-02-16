import React from 'react';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import { buildNestedKey } from 'utils';

const modelName = 'memberDetails';

const MemberDetails = ({ handleChange, sectionName, t, registerStep })=>
  <Wizard.Step
    header={t(`${buildNestedKey(sectionName, modelName, 'header')}`)}
    modelName={modelName}
    registerStep={registerStep}
  >
    household member details page
  </Wizard.Step>

export default withLocale(MemberDetails);
