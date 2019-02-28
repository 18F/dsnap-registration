import React from 'react';
import { withRouter } from 'react-router-dom';
import Wizard from 'components/wizard'

const modelName = 'review';

class Review extends React.Component {
  render() {
    return (
      <Wizard.Section name={modelName} {...this.props}>
        { this.props.children }
      </Wizard.Section>
    );
  }
}

export { Review };
export default withRouter(Review);
