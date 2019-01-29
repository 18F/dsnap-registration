import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Field } from 'formik';
import Wizard from 'components/wizard'
import LocaleContext from 'locale-context';
import Input from 'components/input';
import basicInfo from 'models/basic-info';
import { nameValidator } from 'validators/basic-info';

class BasicInfoStep extends React.Component {
  static propTypes = {
    name: PropTypes.string,
  }

  handleFormComplete = () => {
    alert('i am done');
  }

  getSectionKey(...sectionName) {
    return sectionName.reduce((accum, section) =>
      `${accum}.${section}`
    , `${this.props.name}`);
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
              <Wizard.Section name="applicantName">
                <Wizard.Context>
                  {({ sectionName }) => {
                    return (
                      <Wizard.Step
                        header={t(`${this.getSectionKey(sectionName)}.header`)}
                        validate={nameValidator}
                      >
                        <section>
                          <Field
                            name={`${this.getSectionKey(sectionName)}.firstName`}
                            render={({ field }) => {
                              return (
                                <Input
                                  {...field}
                                  explanation={t(`${this.getSectionKey(sectionName)}.firstName.explanation`)}
                                  labelText={t(`${this.getSectionKey(sectionName)}.firstName.label`)}
                                />
                              );
                            }}
                          />
                          <Field
                            name={`${this.getSectionKey(sectionName)}.middleName`}
                            render={({ field }) => {
                              return (
                                <Input
                                  {...field}
                                  labelText={t(`${this.getSectionKey(sectionName)}.middleName.label`)}
                                />
                              );
                            }}
                          />
                          <Field
                            name={`${this.getSectionKey(sectionName)}.lastName`}
                            render={({ field }) => {
                              return (
                                <Input
                                  {...field}
                                  labelText={t(`${this.getSectionKey(sectionName)}.lastName.label`)}
                                />
                              );
                            }}
                          />
                        </section>
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


export { BasicInfoStep };
export default withRouter(BasicInfoStep);
