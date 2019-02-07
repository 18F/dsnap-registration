import React from 'react';
import FSMRouter, { MachineConsumer } from 'components/fsm';
import Wizard from 'components/wizard';
import basicInfo from 'models/basic-info';
import fsmConfig from 'fsm-config';

class DSNAPForm extends React.Component {
  state = {
    basicInfo: basicInfo()
  }

  handleFormComplete = (values) => {
    this.setState(state => ({ ...state, ...values }));
  }

  render() {
    const { config } = this.props
    return (
      <FSMRouter config={fsmConfig}>
        <MachineConsumer>
          {(handleNext) => {
            return (
              <Wizard
                initialValues={this.state}
                onNext={handleNext}
                onDone={this.handleFormComplete}
                config={config}
              />
            );
          }}
        </MachineConsumer>
      </FSMRouter>
    );
  }
}

export default DSNAPForm;
