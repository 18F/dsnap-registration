import React from 'react';
import { withRouter } from 'react-router-dom';
import withLocale from 'components/with-locale';
import Wizard from 'components/wizard'

class Submit extends React.Component {
  render() {
    const { t, ...rest } = this.props;

    return (
      <Wizard.Section name="submit" {...rest} nextButton={t('submit.next')}>
        {this.props.children}
      </Wizard.Section>
    );
  }
}

export { Submit };
export default withRouter(withLocale(Submit));
