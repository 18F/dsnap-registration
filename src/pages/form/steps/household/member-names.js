import React from 'react';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import { buildNestedKey } from 'utils';
import { getCustomerFirstName } from 'models/basic-info';

const modelName = 'memberNames';

const MemberNames = ({ handleChange, sectionName, t, registerStep }) =>
  <Wizard.Context>
    {({ basicInfo }) => {
      const customerName = getCustomerFirstName(basicInfo);

      return (
        <Wizard.Step
          header={
            t(`${buildNestedKey(sectionName, modelName, 'header')}`, { customerName })
          }
          modelName={modelName}
          registerStep={registerStep}
        >
          member name enumeration page
        </Wizard.Step>
      )
    }}
  </Wizard.Context>

export default withLocale(MemberNames);
