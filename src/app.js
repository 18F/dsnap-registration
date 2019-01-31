import React from 'react';
import { withRouter } from 'react-router-dom';
import Wizard from './components/wizard'
import LocaleContext from './locale-context';
import { Field } from 'formik';
import Input from 'components/input';
import basicInfo from 'models/basic-info';

const PREFIX = 'basicInfo.applicantName';

class App extends React.Component {
  handleFormComplete = (values) => {
    this.props.history.push('/form/complete');
  }

  render() {
    return (
      <LocaleContext.Consumer>
        {(t) => {
          return (              
            <Wizard
              initialValues={{ basicInfo }}
              onDone={this.handleFormComplete}
            >
              <Wizard.Section name="name">
                <Wizard.Step
                  title={t(`${PREFIX}.header`)}
                  validate={({ name }) => {
                    let errors = {};

                    if (!name.firstName) {
                      errors = { name: { firstName: t('errors.required') } };
                    }

                    return errors;
                  }}
                >
                  <Field
                    name="name.firstName"
                    render={({ field }) => {
                      return (
                        <Input
                          {...field}
                          explanation={t(`${PREFIX}.firstName.explanation`)}
                          labelText={t(`${PREFIX}.firstName.label`)}
                        />
                      );
                    }}
                  />
                </Wizard.Step>
                <Wizard.Step title="h">
                  <div className="margin-y-2">
                    step 2
                  </div>
                </Wizard.Step>
              </Wizard.Section>

              <Wizard.Section>
                <Wizard.Step title="g">
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
