import React from 'react';
import { withRouter } from 'react-router-dom';
import Wizard from 'components/wizard'

class Submit extends React.Component {
  render() {
    const { t, ...rest } = this.props;

    return (
      <Wizard.Section name="submit" {...rest}>
        {this.props.children}
      </Wizard.Section>
    );
  }
}

export { Submit };
export default withRouter(Submit);
