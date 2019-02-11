import React from 'react';
import FSMRouter, { MachineConsumer, MachineState } from 'components/fsm';
import Wizard from 'components/wizard';
import fsmConfig from 'fsm-config';
import Button from 'components/button';

class DSNAPForm extends React.Component {
  handleFormComplete = (values) => {
    this.setState(state => ({ ...state, ...values }));
  }

  render() {
    const { config } = this.props
    return (
      <FSMRouter config={fsmConfig}>
        <MachineConsumer>
          {(transition) => (
            <MachineState>
              {(state) => {
                return (
                  <>
                    <Wizard
                      initialValues={state.context}
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
            </MachineState>
          )}
        </MachineConsumer>
      </FSMRouter>
    );
  }
}

export default DSNAPForm;
