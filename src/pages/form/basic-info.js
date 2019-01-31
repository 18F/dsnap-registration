import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Wizard from 'components/wizard'
import LocaleContext from 'locale-context';
import basicInfo from 'models/basic-info';
import { nameValidator } from 'validators/basic-info';
import { buildNestedKey } from 'utils';
import FormikField from 'components/formik-field';

const modelName = 'basicInfo';

class BasicInfoSection extends React.Component {
  static propTypes = {
    modelName: PropTypes.string,
  }

  state = basicInfo()

  handleFormComplete = (values) => {
    this.setState(state => ({ ...state, ...values }));
  }

  render() {
    return (
      <LocaleContext.Consumer>
        {(t) => {
          return (
            <Wizard
              initialValues={this.state}
              onDone={this.handleFormComplete}
            >
              <Wizard.Section name="applicantName">
                <Wizard.Context>
                  {({ sectionName, handleChange }) => {
                    return (
                      <Wizard.Step
                        header={t(`${buildNestedKey(modelName, sectionName)}.header`)}
                        validate={nameValidator}
                      >
                        <fieldset>
                          <FormikField
                            name={`${sectionName}.firstName`}
                            onChange={handleChange}
                            type='input'
                            explanation={t(`${buildNestedKey(modelName, sectionName, 'firstName', 'explanation')}`)}
                            labelText={t(`${buildNestedKey(modelName, sectionName, 'firstName', 'label')}`)}
                          />
                          <FormikField
                            name={`${sectionName}.middleName`}
                            onChange={handleChange}
                            type='input'
                            labelText={t(`${buildNestedKey(modelName, sectionName, 'middleName', 'label')}`)}
                          />
                          <FormikField
                            name={`${sectionName}.lastName`}
                            onChange={handleChange}
                            type='input'
                            labelText={t(`${buildNestedKey(modelName, sectionName, 'lastName', 'label')}`)}
                          />
                        </fieldset>
                      </Wizard.Step>
                    );
                  }}
                </Wizard.Context>
              </Wizard.Section>
            </Wizard>
          );
        }}
      </LocaleContext.Consumer>
    );
  }
}

export { BasicInfoSection };
export default withRouter(BasicInfoSection);
