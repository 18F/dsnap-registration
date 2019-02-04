import React from 'react';
import Wizard from 'components/wizard';
import basicInfo from 'models/basic-info';

class DSNAPForm extends React.Component {
  state = {
    basicInfo: basicInfo()
  }

  handleFormComplete = (values) => {
    this.setState(state => ({ ...state, ...values }));
  }

  render() {
    const { config } = this.props;

    return (
      <Wizard
        initialValues={this.state}
        onDone={this.handleFormComplete}
        config={config}
      />
    );
  }
}

export default DSNAPForm;
