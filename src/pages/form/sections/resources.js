import React from 'react';
import { withRouter } from 'react-router-dom';
import Wizard from 'components/wizard'

const modelName = 'household';

class Resources extends React.Component {
  render() {
    const { t, ...rest } = this.props;

    return (
      <Wizard.Section modelName={[modelName]} {...rest}>
        {this.props.children}
      </Wizard.Section>
    );
  }
}

export { Resources };
export default withRouter(Resources);
