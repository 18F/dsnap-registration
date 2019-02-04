import React from 'react';
import { withRouter } from 'react-router-dom';
import Wizard from 'components/wizard'

const modelName = 'basicInfo';

class BasicInfo extends React.Component {
  handleFormComplete = (values) => {
    this.setState(state => ({ ...state, ...values }));
  }

  render() {
    const { t, ...rest } = this.props;

    return (
      <Wizard.Section name={modelName} {...rest}>
        {this.props.children}
      </Wizard.Section>
    );
  }
}

export { BasicInfo };
export default withRouter(BasicInfo);
