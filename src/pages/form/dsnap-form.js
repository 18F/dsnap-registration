import React from 'react';
import FSMRouter, { MachineConsumer } from 'components/fsm';
import Wizard from 'components/wizard';
import basicInfo from 'models/basic-info';
import identity from 'models/identity';
import fsmConfig from 'fsm-config';
import Button from 'components/button';

class DSNAPForm extends React.Component {
  state = {
    basicInfo: basicInfo(),
    identity: identity(),
  }

  handleFormComplete = (values) => {
    this.setState(state => ({ ...state, ...values }));
  }

  render() {
    const { config } = this.props
    return (
      <FSMRouter config={fsmConfig}>
        <MachineConsumer>
          {(transition) => {
            return (
              <>
                <Wizard
                  initialValues={this.state}
                  onNext={transition}
                  onDone={this.handleFormComplete}
                  config={config}
                />
                <Button
                  type="button"
                  onClick={() => transition({ command: 'QUIT' })}
                  link
                >
                  Quit registration
                </Button>
              </>
            );
          }}
        </MachineConsumer>
      </FSMRouter>
    );
  }
}

export default DSNAPForm;
