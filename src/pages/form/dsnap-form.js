import React from 'react';
import FSMRouter, { MachineConsumer, MachineState } from 'components/fsm';
import Wizard from 'components/wizard';
import fsmConfig from 'fsm-config';
import Button from 'components/button';
import withLocale from 'components/with-locale';

class DSNAPForm extends React.Component {
  render() {
    const { config } = this.props
    return (
      <FSMRouter config={fsmConfig}>
        <MachineConsumer>
          {(transition) => (
            <MachineState>
              {(state) => {
                return (
                  <React.Fragment>
                    <Wizard
                      initialValues={state}
                      onNext={transition}
                      onDone={() => ({})}
                      config={config}
                    />
                    <Button
                      type="button"
                      onClick={() => transition({ command: 'QUIT' })}
                      link
                    >
                      { this.props.t('general.quit') }
                    </Button>
                  </React.Fragment>
                )
              }}
            </MachineState>
          )}
        </MachineConsumer>
      </FSMRouter>
    );
  }
}

export default withLocale(DSNAPForm);
