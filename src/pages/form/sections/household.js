import React from 'react';
import { withRouter } from 'react-router-dom';
import Wizard from 'components/wizard'

const modelName = 'household';

class Household extends React.Component {
  render() {
    const { t, ...rest } = this.props;

    return (
      <Wizard.Section name={modelName} {...rest}>
        { this.props.children }
      </Wizard.Section>
    );
  }
}

export { Household };
export default withRouter(Household);
