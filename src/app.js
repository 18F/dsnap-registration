import React from 'react';
import { withRouter } from 'react-router-dom';
import Wizard from './components/wizard'
import LocaleContext from './locale-context';

class App extends React.Component {
  handleFormComplete = (values) => {
    console.log('form done!')
    this.props.history.push('/components');
  }

  render() {
    return (
      <LocaleContext.Consumer>
        {(t) => {
          return (              
            <Wizard title="Form" onDone={this.handleFormComplete}>
              <Wizard.Section header="my header">
                <Wizard.Step>
                  <div className="margin-y-2">
                    step 1
                  </div>
                </Wizard.Step>
                <Wizard.Step>
                  <div className="margin-y-2">
                    step 2
                  </div>
                </Wizard.Step>
                <Wizard.Step>
                  <div className="margin-y-2">
                    step 3
                  </div>
                </Wizard.Step>
              </Wizard.Section>

              <Wizard.Section>
                <Wizard.Step>
                  <div className="margin-y-2">
                    This is the first step of section 2
                  </div>
                </Wizard.Step>
              </Wizard.Section>
            </Wizard>
          );
        }}
      </LocaleContext.Consumer>
    );
  }
}

export default withRouter(App);
