import React from 'react';
import { withRouter } from 'react-router-dom';
import Wizard from 'components/wizard'
import LocaleContext from 'locale-context';
import basicInfo from 'models/basic-info';
import { nameValidator } from 'validators/basic-info';
import { buildNestedKey } from 'utils';
import FormikField from 'components/formik-field';

const modelName = 'basicInfo';

class BasicInfoSection extends React.Component {
  state = basicInfo()

  handleFormComplete = (values) => {
    this.setState(state => ({ ...state, ...values }));
  }

  render() {
    return (
      <LocaleContext.Consumer>
        {(t) => {
          return null;
        }}
      </LocaleContext.Consumer>
    );
  }
}

export { BasicInfoSection };
export default withRouter(BasicInfoSection);
