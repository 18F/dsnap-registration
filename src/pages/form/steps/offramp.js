import React from 'react';
import PropTypes from 'prop-types';
import Wizard from 'components/wizard';
import withLocale from 'components/with-locale';
import UI from 'components/ui';

class BasicInfoOffRamp extends React.Component {
  render() {
    const { t } = this.props;

    return (
      <section>
        <UI.Header type="h1" border>
          { t(`basicInfo.offramp.header`) }
        </UI.Header>
        <div className="grid-col desktop:grid-col-8 margin-y-4 desktop:font-ui-lg">
          <p>
            { t(`basicInfo.offramp.copy`) }
          </p>
        </div>
        <div className="grid-col desktop:grid-col-8 padding-2 desktop:padding-4 margin-y-4 border radius-md desktop:font-ui-lg border-mint text-mint">
          <p>
            { t(`basicInfo.offramp.alerts.success`) }
          </p>
        </div>
      </section>
    );
  }
}

export default withLocale(BasicInfoOffRamp);
