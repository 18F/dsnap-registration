import React from 'react';
import PropTypes from 'prop-types';
import withLocale from 'components/with-locale';
import UI from 'components/ui';
import { getApplicant } from 'models/household';
import { getFirstName } from 'models/person';
import { MachineState } from 'components/fsm';

class BasicInfoOffRamp extends React.Component {
  static propTypes = {
    t: PropTypes.func,
  }

  render() {
    const { t } = this.props;

    return (
      <MachineState>
        {({ household }) => (
          <section>
            <UI.Header type="h1" border>
              { t('basicInfo.offramp.header', { customerName: getFirstName(getApplicant(household)) }) }
            </UI.Header>
            <div className="grid-col desktop:grid-col-8 margin-y-4 desktop:font-ui-lg">
              <p>
                { t('basicInfo.offramp.copy') }
              </p>
            </div>
          </section>
        )}
      </MachineState>
    );
  }
}

export default withLocale(BasicInfoOffRamp);
