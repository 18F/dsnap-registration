import React from 'react';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard';
import UI from 'components/ui';
import { buildNestedKey } from 'utils';
import { helpers } from 'locales';

const modelName = 'getPrepared';

const GetPrepared = ({ sectionName, t, registerStep })=>
  <Wizard.Step
    header={t(`${buildNestedKey(sectionName, modelName, 'header')}`)}
    modelName={modelName}
    registerStep={registerStep}
  >
    <div className="margin-bottom-6">
      <UI.Header>
        { t(`${buildNestedKey(sectionName, modelName, 'conditions', 'header')}`) }
      </UI.Header>
      {
        helpers.renderListT({
          name: buildNestedKey(sectionName, modelName, 'conditions', 'body')
        })
      }
    </div>
  </Wizard.Step>

export default withLocale(GetPrepared);
