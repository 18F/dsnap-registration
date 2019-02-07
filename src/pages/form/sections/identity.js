import React from 'react';
import { withRouter } from 'react-router-dom';
import Wizard from 'components/wizard'

class IdentitySection extends React.Component {
  handleFormComplete = (values) => {
    this.setState(state => ({ ...state, ...values }));
  }

  render() {
    const { t, ...rest } = this.props;

    return (
      <Wizard.Section name="identity" {...rest}>
        { this.props.children }
      </Wizard.Section>
    );
  }
}

export { IdentitySection };
export default withRouter(IdentitySection);
